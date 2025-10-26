import { type ExecutionContext, createParamDecorator } from '@nestjs/common';
import type { Request } from 'express';

import { UserSession } from '@orpheus/schemas';

export const CurrentUserSession = createParamDecorator(
  (
    _data: unknown,
    executionContext: ExecutionContext
  ): UserSession | undefined => {
    const request = executionContext.switchToHttp().getRequest<Request>();

    return request.user;
  }
);
