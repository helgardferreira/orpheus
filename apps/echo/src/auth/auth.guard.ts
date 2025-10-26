import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { UserSessionSchema } from '@orpheus/schemas';

import { AuthConfig } from '../common/schemas';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService<AuthConfig>,
    private jwtService: JwtService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret:
          this.configService.getOrThrow<AuthConfig['JWT_SECRET']>('JWT_SECRET'),
      });

      const {
        sub,
        user: { createdAt, updatedAt, username },
      } = payload;

      const user = UserSessionSchema.decode({
        createdAt,
        id: sub,
        updatedAt,
        username,
      });

      request.user = user;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
