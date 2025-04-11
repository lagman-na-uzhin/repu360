import { createParamDecorator } from '@nestjs/common';
import {Manager, ManagerId} from "@domain/manager/manager";
import {EmployeeRole} from "@domain/employee/model/employee-role";
import {Employee} from "@domain/employee/employee";

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
  const { actor, ownerId }: {actor: Employee, ownerId: ManagerId | null} = req
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


export const ManagerBody = createParamDecorator((data, req) => {
  const { actor, ownerId }: {actor: Manager} = req
      .switchToHttp()
      .getRequest().user;

  const body = req.switchToHttp().getRequest().body;


  return {
    actor,
    ownerId,
    ...body,
  };
});

export const ManagerInitQuery = createParamDecorator((data, req) => {
  const { actor, ownerId }: {actor: Manager} = req
      .switchToHttp()
      .getRequest().user;

  const query = req.switchToHttp().getRequest().query;

  return {
    actor,
    ownerId,
    ...query,
  };
});

export const ManagerQuery = createParamDecorator((data, req) => {
  const { actor, ownerId }: {actor: Manager} = req
      .switchToHttp()
      .getRequest().user;

  const query = req.switchToHttp().getRequest().query;

  return {
    actor,
    ownerId,
    ...query,
  };
});
