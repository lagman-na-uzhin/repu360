import {createParamDecorator, ExecutionContext} from '@nestjs/common';

export const RequestParams = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const params = request.params;

        if (data) {
            return params[data];
        }
        return params;
    },
);

