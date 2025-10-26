import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  signIn(@Body() loginDto: { username: string; password: string }) {
    return this.authService.signIn(loginDto.username, loginDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getProfile(@Request() req: any) {
    return req.user;
  }
}
