import { createParamDecorator } from '@nestjs/common';
import {Actor} from "@domain/policy/actor";

export const RequestBody = createParamDecorator((data, req) => {
  const actor: Actor = req
    .switchToHttp()
    .getRequest().user;

  const body = req.switchToHttp().getRequest().body;


  return {
    actor,
    ...body,
  };
});

export const RequestInitQuery = createParamDecorator((data, req) => {
  const actor: Actor = req
      .switchToHttp()
      .getRequest().user;

  const query = req.switchToHttp().getRequest().query;

  return {
    actor,
    ...query,
  };
});

export const RequestQuery = createParamDecorator((data, req) => {
  const actor: Actor = req
      .switchToHttp()
      .getRequest().user;

  const query = req.switchToHttp().getRequest().query;

  return {
    actor,
    ...query,
  };
});

