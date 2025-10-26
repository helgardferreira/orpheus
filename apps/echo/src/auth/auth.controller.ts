import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';

import {
  type AccessToken,
  AccessTokenSchema,
  type SignInUser,
  SignInUserSchema,
  type SignUpUser,
  SignUpUserSchema,
} from '@orpheus/schemas';

import { ZodResponseInterceptor } from '../common/interceptors';
import { ZodValidationPipe } from '../common/pipes';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  @UseInterceptors(new ZodResponseInterceptor(AccessTokenSchema))
  signIn(
    @Body(new ZodValidationPipe(SignInUserSchema)) body: SignInUser
  ): Promise<AccessToken> {
    return this.authService.signIn(body);
  }

  @Post('sign-up')
  @UseInterceptors(new ZodResponseInterceptor(AccessTokenSchema))
  signUp(
    @Body(new ZodValidationPipe(SignUpUserSchema)) body: SignUpUser
  ): Promise<AccessToken> {
    return this.authService.signUp(body);
  }
}
