// src/auth/local-auth.guard.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    return result;
  }
}
