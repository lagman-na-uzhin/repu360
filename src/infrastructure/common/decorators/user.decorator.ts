import { createParamDecorator } from '@nestjs/common';
import {ManagerId} from "@domain/manager/manager";
import {EmployeeRole} from "@domain/company/model/employee/employee-role";

export const UserBody = createParamDecorator((data, req) => {
  const { actor, ownerId }: {actor: EmployeeRole, ownerId: ManagerId | null} = req
    .switchToHttp()
    .getRequest().user;

  const body = req.switchToHttp().getRequest().body;


  return {
    actor,
    ownerId,
    ...body,
  };
});

export const UserInitQuery = createParamDecorator((data, req) => {
  const { actor, ownerId }: {actor: EmployeeRole, ownerId: ManagerId | null} = req
      .switchToHttp()
      .getRequest().user;

  const query = req.switchToHttp().getRequest().query;

  return {
    actor,
    ownerId,
    ...query,
  };
});

export const UserQuery = createParamDecorator((data, req) => {
  const { actor, ownerId }: {actor: EmployeeRole, ownerId: ManagerId | null} = req
      .switchToHttp()
      .getRequest().user;

  const query = req.switchToHttp().getRequest().query;

  return {
    actor,
    ownerId,
    ...query,
  };
});
