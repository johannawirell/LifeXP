import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { createHash } from 'crypto';

import { OAuthProvider, PrismaClient } from '../../generated/client';

type AuthIntent = 'login' | 'register';

type RedirectState = {
  redirectUri: string;
  intent: AuthIntent;
  provider: OAuthProvider;
};

type SessionTokens = {
  accessToken: string;
  refreshToken: string;
};

type OAuthIdentity = {
  provider: OAuthProvider;
  providerUserId: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

type JwtPayloadLike = {
  sub?: string;
  email?: string;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
};

type AppleCallbackInput = {
  code: string;
  idToken?: string;
  state: string;
  user?: string;
};
@Injectable()
export class AuthService {
  private readonly prisma = new PrismaClient();

  getGoogleAuthorizationUrl(redirectUri: string, intent: string, provider: OAuthProvider) {
    try {
      const state = this.encodeState({
        redirectUri,
        intent: this.normalizeIntent(intent),
        provider,
      });

      const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      url.searchParams.set('client_id', this.requireEnv('GOOGLE_CLIENT_ID'));
      url.searchParams.set('redirect_uri', this.requireEnv('GOOGLE_CALLBACK_URL'));
      url.searchParams.set('response_type', 'code');
      url.searchParams.set('scope', 'openid email profile');
      url.searchParams.set('access_type', 'offline');
      url.searchParams.set('prompt', 'consent select_account');
      url.searchParams.set('state', state);
      return url.toString();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown Google auth error.';
      throw new BadRequestException(`Google start failed: ${message}`);
    }
  }

  async handleGoogleCallback(code: string, state: string) {
    const { createRemoteJWKSet, jwtVerify } = await import('jose');
    const parsedState = this.decodeState(state);

    const tokenResponse = await axios.post(
      'https://oauth2.googleapis.com/token',
      new URLSearchParams({
        code,
        client_id: this.requireEnv('GOOGLE_CLIENT_ID'),
        client_secret: this.requireEnv('GOOGLE_CLIENT_SECRET'),
        redirect_uri: this.requireEnv('GOOGLE_CALLBACK_URL'),
        grant_type: 'authorization_code',
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const idToken = tokenResponse.data.id_token as string | undefined;

    if (!idToken) {
      throw new UnauthorizedException('Google did not return an ID token.');
    }

    const ticket = await jwtVerify(idToken, createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs')), {
      audience: this.requireEnv('GOOGLE_CLIENT_ID'),
      issuer: ['https://accounts.google.com', 'accounts.google.com'],
    });

    const identity = this.mapGoogleIdentity(ticket.payload, parsedState.provider);
    return this.finishOAuthLogin(identity, parsedState);
  }

  getAppleAuthorizationUrl(redirectUri: string, intent: string) {
    const state = this.encodeState({
      redirectUri,
      intent: this.normalizeIntent(intent),
      provider: OAuthProvider.APPLE,
    });

    const url = new URL('https://appleid.apple.com/auth/authorize');
    url.searchParams.set('client_id', this.requireEnv('APPLE_CLIENT_ID'));
    url.searchParams.set('redirect_uri', this.requireEnv('APPLE_CALLBACK_URL'));
    url.searchParams.set('response_type', 'code id_token');
    url.searchParams.set('response_mode', 'form_post');
    url.searchParams.set('scope', 'name email');
    url.searchParams.set('state', state);
    url.searchParams.set('nonce', this.hashValue(state));
    return url.toString();
  }

  async handleAppleCallback(input: AppleCallbackInput) {
    const { createRemoteJWKSet, jwtVerify } = await import('jose');
    const parsedState = this.decodeState(input.state);
    const clientSecret = await this.createAppleClientSecret();

    const tokenResponse = await axios.post(
      'https://appleid.apple.com/auth/token',
      new URLSearchParams({
        client_id: this.requireEnv('APPLE_CLIENT_ID'),
        client_secret: clientSecret,
        code: input.code,
        grant_type: 'authorization_code',
        redirect_uri: this.requireEnv('APPLE_CALLBACK_URL'),
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const idToken = (input.idToken || tokenResponse.data.id_token) as string | undefined;

    if (!idToken) {
      throw new UnauthorizedException('Apple did not return an ID token.');
    }

    const ticket = await jwtVerify(idToken, createRemoteJWKSet(new URL('https://appleid.apple.com/auth/keys')), {
      audience: this.requireEnv('APPLE_CLIENT_ID'),
      issuer: 'https://appleid.apple.com',
    });

    const appleUser = input.user ? JSON.parse(input.user) as { name?: { firstName?: string; lastName?: string } } : null;
    const identity = this.mapAppleIdentity(ticket.payload, appleUser);
    return this.finishOAuthLogin(identity, parsedState);
  }

  async refreshSession(refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required.');
    }

    const tokenHash = this.hashValue(refreshToken);
    const session = await this.prisma.refreshToken.findUnique({
      where: {
        tokenHash,
      },
      include: {
        authUser: true,
      },
    });

    if (!session || session.revokedAt || session.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedException('Refresh token is invalid or expired.');
    }

    await this.prisma.refreshToken.update({
      where: {
        id: session.id,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    const tokens = await this.issueSessionTokens(session.authUser.id);

    return {
      userId: session.authUser.id,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async logout(refreshToken: string) {
    if (!refreshToken) {
      return { success: true };
    }

    const tokenHash = this.hashValue(refreshToken);
    await this.prisma.refreshToken.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    return { success: true };
  }

  async deleteAccount(userId: string) {
    await this.prisma.authUser.deleteMany({
      where: {
        id: userId,
      },
    });

    return { success: true };
  }

  private async finishOAuthLogin(identity: OAuthIdentity, state: RedirectState) {
    const { authUser, isNewUser } = await this.upsertOAuthUser(identity);

    await this.provisionAppUser(authUser.id, identity);

    const tokens = await this.issueSessionTokens(authUser.id);

    return this.buildRedirectUrl(state.redirectUri, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      userId: authUser.id,
      provider: identity.provider.toLowerCase(),
      intent: state.intent,
      isNewUser: String(isNewUser),
    });
  }

  private async upsertOAuthUser(identity: OAuthIdentity) {
    const existingAccount = await this.prisma.oAuthAccount.findUnique({
      where: {
        provider_providerUserId: {
          provider: identity.provider,
          providerUserId: identity.providerUserId,
        },
      },
      include: {
        authUser: true,
      },
    });

    if (existingAccount) {
      const authUser = await this.prisma.authUser.update({
        where: {
          id: existingAccount.authUserId,
        },
        data: {
          email: identity.email,
          displayName: identity.displayName,
          avatarUrl: identity.avatarUrl,
        },
      });

      return { authUser, isNewUser: false };
    }

    const authUser = await this.prisma.authUser.upsert({
      where: {
        email: identity.email,
      },
      update: {
        displayName: identity.displayName,
        avatarUrl: identity.avatarUrl,
      },
      create: {
        email: identity.email,
        displayName: identity.displayName,
        avatarUrl: identity.avatarUrl,
      },
    });

    await this.prisma.oAuthAccount.create({
      data: {
        authUserId: authUser.id,
        provider: identity.provider,
        providerUserId: identity.providerUserId,
        email: identity.email,
      },
    });

    return { authUser, isNewUser: true };
  }

  private async provisionAppUser(authUserId: string, identity: OAuthIdentity) {
    const userServiceUrl = this.requireEnv('USER_SERVICE_URL');
    const gamificationServiceUrl = this.requireEnv('GAMIFICATION_SERVICE_URL');
    const analyticsServiceUrl = this.requireEnv('ANALYTICS_SERVICE_URL');

    await Promise.all([
      axios.post(`${userServiceUrl}/profile/provision`, {
        authUserId,
        email: identity.email,
        displayName: identity.displayName,
        firstName: identity.firstName ?? undefined,
        lastName: identity.lastName ?? undefined,
        avatarUrl: identity.avatarUrl ?? undefined,
      }),
      axios.post(`${gamificationServiceUrl}/profile-gamification/provision`, {
        userId: authUserId,
      }),
      axios.post(`${analyticsServiceUrl}/profile-stats/provision`, {
        userId: authUserId,
      }),
    ]);
  }

  private async issueSessionTokens(userId: string): Promise<SessionTokens> {
    const { SignJWT, jwtVerify } = await import('jose');
    const accessToken = await new SignJWT({ sub: userId, type: 'access' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(this.requireEnv('JWT_ACCESS_EXPIRES_IN'))
      .sign(this.getJwtSecret('JWT_ACCESS_SECRET'));

    const refreshToken = await new SignJWT({ sub: userId, type: 'refresh' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(this.requireEnv('JWT_REFRESH_EXPIRES_IN'))
      .sign(this.getJwtSecret('JWT_REFRESH_SECRET'));

    const refreshPayload = await jwtVerify(refreshToken, this.getJwtSecret('JWT_REFRESH_SECRET'));

    await this.prisma.refreshToken.create({
      data: {
        authUserId: userId,
        tokenHash: this.hashValue(refreshToken),
        expiresAt: new Date((refreshPayload.payload.exp ?? 0) * 1000),
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private mapGoogleIdentity(payload: JwtPayloadLike, provider: OAuthProvider): OAuthIdentity {
    const email = payload.email;
    const subject = payload.sub;

    if (typeof email !== 'string' || typeof subject !== 'string') {
      throw new UnauthorizedException('Google identity is missing required fields.');
    }

    return {
      provider,
      providerUserId: subject,
      email,
      displayName: typeof payload.name === 'string' ? payload.name : email.split('@')[0],
      avatarUrl: typeof payload.picture === 'string' ? payload.picture : null,
      firstName: typeof payload.given_name === 'string' ? payload.given_name : null,
      lastName: typeof payload.family_name === 'string' ? payload.family_name : null,
    };
  }

  private mapAppleIdentity(
    payload: JwtPayloadLike,
    appleUser: { name?: { firstName?: string; lastName?: string } } | null
  ): OAuthIdentity {
    const email = payload.email;
    const subject = payload.sub;

    if (typeof email !== 'string' || typeof subject !== 'string') {
      throw new UnauthorizedException('Apple identity is missing required fields.');
    }

    const firstName = appleUser?.name?.firstName ?? null;
    const lastName = appleUser?.name?.lastName ?? null;
    const displayName =
      [firstName, lastName].filter(Boolean).join(' ').trim() || email.split('@')[0];

    return {
      provider: OAuthProvider.APPLE,
      providerUserId: subject,
      email,
      displayName,
      avatarUrl: null,
      firstName,
      lastName,
    };
  }

  private normalizeIntent(intent: string | undefined): AuthIntent {
    return intent === 'register' ? 'register' : 'login';
  }

  private encodeState(state: RedirectState) {
    this.validateRedirectUri(state.redirectUri);
    return Buffer.from(JSON.stringify(state)).toString('base64url');
  }

  private decodeState(state: string): RedirectState {
    try {
      const parsed = JSON.parse(Buffer.from(state, 'base64url').toString('utf8')) as RedirectState;
      this.validateRedirectUri(parsed.redirectUri);
      return {
        redirectUri: parsed.redirectUri,
        intent: this.normalizeIntent(parsed.intent),
        provider: parsed.provider,
      };
    } catch {
      throw new BadRequestException('Invalid OAuth state.');
    }
  }

  private validateRedirectUri(redirectUri: string) {
    const allowed = (process.env.AUTH_ALLOWED_REDIRECT_URIS ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);

    if (allowed.length === 0) {
      return;
    }

    const isAllowed = allowed.some((prefix) => redirectUri.startsWith(prefix));

    if (!isAllowed) {
      throw new BadRequestException('Redirect URI is not allowed.');
    }
  }

  private buildRedirectUrl(redirectUri: string, params: Record<string, string>) {
    const url = new URL(redirectUri);

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    return url.toString();
  }

  private async createAppleClientSecret() {
    const { importPKCS8, SignJWT } = await import('jose');
    const teamId = this.requireEnv('APPLE_TEAM_ID');
    const clientId = this.requireEnv('APPLE_CLIENT_ID');
    const keyId = this.requireEnv('APPLE_KEY_ID');
    const privateKey = this.requireEnv('APPLE_PRIVATE_KEY').replace(/\\n/g, '\n');
    const signingKey = await importPKCS8(privateKey, 'ES256');

    return new SignJWT({})
      .setProtectedHeader({ alg: 'ES256', kid: keyId })
      .setIssuer(teamId)
      .setSubject(clientId)
      .setAudience('https://appleid.apple.com')
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(signingKey);
  }

  private requireEnv(name: string) {
    const value = process.env[name];

    if (!value) {
      throw new BadRequestException(`Missing environment variable: ${name}`);
    }

    return value;
  }

  private getJwtSecret(name: string) {
    return new TextEncoder().encode(this.requireEnv(name));
  }

  private hashValue(value: string) {
    return createHash('sha256').update(value).digest('hex');
  }
}
