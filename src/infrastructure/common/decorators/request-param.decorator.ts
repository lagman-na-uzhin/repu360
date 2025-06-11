import { createParamDecorator } from '@nestjs/common';

export const RequestParams = createParamDecorator((data, req) => {
    const params = req.switchToHttp().getRequest().params;

    return {
        ...params,
    };
});

