import { Module } from '@nestjs/common';
import { UsecaseProxyModule } from '@infrastructure/providers/usecase-proxy.module';
import {AuthController} from "@presentation/general/auth/auth.controller";

@Module({
    imports: [UsecaseProxyModule.register()],
    providers: [],
    controllers: [AuthController],
})
export class GeneralModule {}
