import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    @Body() createAuthDto: RegisterAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.register(createAuthDto, res);
  }

  @Post('login')
  login(
    @Body() createAuthDto: RegisterAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(createAuthDto, res);
  }

  @Get('profile')
  getProfile() {
    return this.authService.getProfile();
  }
}
