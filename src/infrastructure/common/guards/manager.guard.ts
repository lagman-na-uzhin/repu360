import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from "@domain/manager/value-object/manager-role.vo";

@Injectable()
export class ManagerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user = context.switchToHttp().getRequest().user;

    if (user.authRole === UserRole.MANAGER) return true;
    if (user.authRole === UserRole.ADMIN) return true;
    if (user.authRole === UserRole.PARTNER && user.ownerId !== 0) return true;

    return false;
  }
}
