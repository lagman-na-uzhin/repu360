import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user = context.switchToHttp().getRequest().user;
    const permission = this.reflector.get<string>('permission', context.getHandler());

    if (!permission) return true;
    if (!user?.permissions?.length) return false;

    return this.checkPermission(user.permissions, permission);
  }

  checkPermission(userPermission: any, action: string) {
    return userPermission.findIndex((userPermission) => userPermission.action === action) !== -1;
  }
}
