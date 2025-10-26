import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthConfig } from '../common/schemas';
import { UsersModule } from '../users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService<AuthConfig>],
      useFactory: (configService: ConfigService<AuthConfig>) => ({
        secret:
          configService.getOrThrow<AuthConfig['JWT_SECRET']>('JWT_SECRET'),
        signOptions: {
          expiresIn:
            configService.getOrThrow<AuthConfig['JWT_EXPIRES_IN']>(
              'JWT_EXPIRES_IN'
            ),
        },
      }),
    }),
    UsersModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
