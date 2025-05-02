import { createParamDecorator } from '@nestjs/common';

export const RequestQuery = createParamDecorator((data, req) => {
  const query = req.switchToHttp().getRequest().query;
  return {
    ...query,
  };
});

export const RequestInitQuery = createParamDecorator((data, req) => {
  const query = req.switchToHttp().getRequest().query;
  return {
    ...query,
  };
});


