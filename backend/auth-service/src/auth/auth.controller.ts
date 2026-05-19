import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Query, Res } from '@nestjs/common';

import { AuthService } from './auth.service';

const authService = new AuthService();

@Controller('auth')
export class AuthController {
  @Get('google/start')
  startGoogleAuth(@Query('redirectUri') redirectUri: string, @Query('intent') intent: string, @Res() res: any) {
    if (!redirectUri) {
      throw new BadRequestException('redirectUri is required.');
    }

    res.redirect(authService.getGoogleAuthorizationUrl(redirectUri, intent, 'GOOGLE'));
  }

  @Get('android/start')
  startAndroidAuth(@Query('redirectUri') redirectUri: string, @Query('intent') intent: string, @Res() res: any) {
    res.redirect(authService.getGoogleAuthorizationUrl(redirectUri, intent, 'ANDROID'));
  }

  @Get('google/callback')
  async handleGoogleCallback(@Query('code') code: string, @Query('state') state: string, @Res() res: any) {
    const redirectUrl = await authService.handleGoogleCallback(code, state);
    res.redirect(redirectUrl);
  }

  @Get('apple/start')
  startAppleAuth(@Query('redirectUri') redirectUri: string, @Query('intent') intent: string, @Res() res: any) {
    res.redirect(authService.getAppleAuthorizationUrl(redirectUri, intent));
  }

  @Get('apple/callback')
  async handleAppleCallbackGet(
    @Query('code') code: string,
    @Query('id_token') idToken: string | undefined,
    @Query('state') state: string,
    @Res() res: any
  ) {
    const redirectUrl = await authService.handleAppleCallback({
      code,
      idToken,
      state,
    });

    res.redirect(redirectUrl);
  }

  @Post('apple/callback')
  async handleAppleCallbackPost(
    @Body()
    body: {
      code: string;
      id_token?: string;
      state: string;
      user?: string;
    },
    @Res() res: any
  ) {
    const redirectUrl = await authService.handleAppleCallback({
      code: body.code,
      idToken: body.id_token,
      state: body.state,
      user: body.user,
    });

    res.redirect(redirectUrl);
  }

  @Post('refresh')
  refresh(@Body() body: { refreshToken?: string }) {
    return authService.refreshSession(body.refreshToken ?? '');
  }

  @Post('logout')
  logout(@Body() body: { refreshToken?: string }) {
    return authService.logout(body.refreshToken ?? '');
  }

  @Delete('users/:userId')
  deleteAccount(@Param('userId') userId: string) {
    return authService.deleteAccount(userId);
  }
}
