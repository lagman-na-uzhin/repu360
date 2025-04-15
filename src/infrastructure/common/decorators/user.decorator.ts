import { createParamDecorator } from '@nestjs/common';
import {Actor} from "@domain/policy/actor";

export const ActorBody = createParamDecorator((data, req) => {
  const actor: Actor = req
    .switchToHttp()
    .getRequest().user;

  const body = req.switchToHttp().getRequest().body;


  return {
    actor,
    ...body,
  };
});

export const ActorInitQuery = createParamDecorator((data, req) => {
  const actor: Actor = req
      .switchToHttp()
      .getRequest().user;

  const query = req.switchToHttp().getRequest().query;

  return {
    actor,
    ...query,
  };
});

export const ActorQuery = createParamDecorator((data, req) => {
  const actor: Actor = req
      .switchToHttp()
      .getRequest().user;

  const query = req.switchToHttp().getRequest().query;

  return {
    actor,
    ...query,
  };
});

