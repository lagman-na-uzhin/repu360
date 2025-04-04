import { createParamDecorator } from '@nestjs/common';

export const UserBody = createParamDecorator((data, req) => {
  const { authId, authPartnerId, authRole, ownerId } = req
    .switchToHttp()
    .getRequest().user;

  const body = req.switchToHttp().getRequest().body;

  delete body?.authId;
  delete body?.authRole;
  delete body?.partnerId;
  delete body?.ownerId;

  return {
    authId: ownerId ? ownerId : authId,
    partnerId: authPartnerId,
    authRole,
    ownerId,
    ...body,
  };
});

export const UserInitQuery = createParamDecorator((data, req) => {
  const { authId, authPartnerId, authRole, ownerId } = req
    .switchToHttp()
    .getRequest().user;

  const query = req.switchToHttp().getRequest().query;

  delete query?.authId;
  delete query?.authRole;
  delete query?.partnerId;
  delete query?.ownerId;

  return {
    authId: authId,
    partnerId: authPartnerId,
    authRole,
    ownerId,
    ...query,
  };
});

export const UserQuery = createParamDecorator((data, req) => {
  const { authId, authPartnerId, authRole, ownerId } = req
    .switchToHttp()
    .getRequest().user;

  const query = req.switchToHttp().getRequest().query;

  delete query?.authId;
  delete query?.authRole;
  delete query?.partnerId;
  delete query?.ownerId;

  return {
    authId: ownerId ? ownerId : authId,
    partnerId: authPartnerId,
    authRole,
    ownerId,
    ...query,
  };
});
