import { Controller, Get } from '@nestjs/common';
import axios from 'axios';

@Controller('profile')
export class ProfileController {
  @Get()
  async getProfile() {
    const userServiceUrl = process.env.USER_SERVICE_URL ?? 'http://localhost:3001';
    const response = await axios.get(`${userServiceUrl}/profile`);

    return response.data;
  }
}
