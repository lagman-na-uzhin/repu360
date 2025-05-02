import {createParamDecorator} from "@nestjs/common";
import {Actor} from "@domain/policy/actor";

export const RequestActor = createParamDecorator((data, req): Actor => {
    return req
        .switchToHttp()
        .getRequest().user;

});
