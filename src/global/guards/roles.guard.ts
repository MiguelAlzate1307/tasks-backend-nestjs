import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RolesEnum } from 'src/modules/users/enums/roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Request } from 'express';
import { TokenPayload } from 'src/modules/auth/models/token-payload.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<RolesEnum[]>(ROLES_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);

    if (!roles) return true;

    const req: Request = context.switchToHttp().getRequest();

    return roles.includes((req.user as TokenPayload).role);
  }
}
