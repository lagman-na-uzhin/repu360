import {createParamDecorator} from "@nestjs/common";

export const RequestBody = createParamDecorator((data, req) => {
    const body = req.switchToHttp().getRequest().body;
    return {
        ...body,
    };
});
