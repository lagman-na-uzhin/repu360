import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import {ManagerRole} from "@domain/manager/model/manager-role";
import {ManagerId} from "@domain/manager/manager";

@Injectable()
export class ManagerGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const {role}: { role: ManagerRole, userId: ManagerId}= context.switchToHttp().getRequest().user;

    if (role.type.isManager()) return true;
    return role.type.isAdmin();
  }
}
