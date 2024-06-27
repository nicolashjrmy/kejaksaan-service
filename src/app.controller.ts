import { Controller, Get, UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
@Controller()
export class AppController {
  @Get()
  getStatus() {
    return { status: 'API is up and running' };
  }
}
