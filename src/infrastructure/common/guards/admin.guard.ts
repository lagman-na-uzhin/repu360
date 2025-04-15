import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {Manager} from "@domain/manager/manager";


@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user = context.switchToHttp().getRequest().user;

    return user.authRole === Manager.ADMIN;
  }
}
