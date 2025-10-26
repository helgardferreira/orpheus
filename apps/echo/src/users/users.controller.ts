import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import {
  type UpdateUser,
  UpdateUserSchema,
  type UserSession,
  UserSessionSchema,
} from '@orpheus/schemas';

import { AuthGuard } from '../auth/auth.guard';
import { CurrentUserSession } from '../common/decorators';
import { ZodResponseInterceptor } from '../common/interceptors';
import { ZodValidationPipe } from '../common/pipes';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  @UseInterceptors(new ZodResponseInterceptor(UserSessionSchema))
  async findUser(
    @CurrentUserSession() userSession: UserSession
  ): Promise<UserSession> {
    const { createdAt, id, updatedAt, username } =
      await this.usersService.findOneById(userSession.id);

    return {
      createdAt,
      id,
      updatedAt,
      username,
    };
  }

  @Patch('me')
  @UseGuards(AuthGuard)
  @UseInterceptors(new ZodResponseInterceptor(UserSessionSchema))
  async updateUser(
    @CurrentUserSession() userSession: UserSession,
    @Body(new ZodValidationPipe(UpdateUserSchema)) body: UpdateUser
  ): Promise<UserSession> {
    const { createdAt, id, updatedAt, username } =
      await this.usersService.update(userSession.id, body);

    return {
      createdAt,
      id,
      updatedAt,
      username,
    };
  }

  @Delete('me')
  @UseGuards(AuthGuard)
  deleteUser(@CurrentUserSession() userSession: UserSession): Promise<void> {
    return this.usersService.delete(userSession.id);
  }
}
