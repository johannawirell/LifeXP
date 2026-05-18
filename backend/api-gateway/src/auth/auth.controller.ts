import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import axios from 'axios';

@Controller('auth')
export class AuthController {
  @Get('google/start')
  async startGoogleAuth(@Query('redirectUri') redirectUri: string, @Query('intent') intent: string, @Res() res: any) {
    const authServiceUrl = process.env.AUTH_SERVICE_URL ?? 'http://localhost:3005';
    const response = await axios.get(`${authServiceUrl}/auth/google/start`, {
      params: {
        redirectUri,
        intent,
      },
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    if (response.status >= 300 && response.status < 400 && response.headers.location) {
      return res.redirect(response.headers.location);
    }

    return res.redirect(`${authServiceUrl}/auth/google/start?redirectUri=${encodeURIComponent(redirectUri)}&intent=${encodeURIComponent(intent ?? 'login')}`);
  }

  @Get('google/callback')
  async handleGoogleCallback(@Query('code') code: string, @Query('state') state: string, @Res() res: any) {
    const authServiceUrl = process.env.AUTH_SERVICE_URL ?? 'http://localhost:3005';
    const response = await axios.get(`${authServiceUrl}/auth/google/callback`, {
      params: { code, state },
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    if (response.status >= 300 && response.status < 400 && response.headers.location) {
      return res.redirect(response.headers.location);
    }

    return res.status(response.status).send(response.data);
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken?: string }) {
    const authServiceUrl = process.env.AUTH_SERVICE_URL ?? 'http://localhost:3005';
    const response = await axios.post(`${authServiceUrl}/auth/refresh`, body);
    return response.data;
  }

  @Post('logout')
  async logout(@Body() body: { refreshToken?: string }) {
    const authServiceUrl = process.env.AUTH_SERVICE_URL ?? 'http://localhost:3005';
    const response = await axios.post(`${authServiceUrl}/auth/logout`, body);
    return response.data;
  }
}
