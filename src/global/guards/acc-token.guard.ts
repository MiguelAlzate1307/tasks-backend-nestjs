import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AccTokenGuard extends AuthGuard('acc-jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const Public = this.reflector.getAllAndOverride<true>(PUBLIC_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);

    if (Public) return true;

    return super.canActivate(context);
  }
}
