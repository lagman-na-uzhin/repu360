import { Module } from '@nestjs/common';
import { UsecaseProxyModule } from '@infrastructure/usecase-proxy/usecase-proxy.module';
import { PartnerController } from '@presentation/default/partner/partner.controller';
import { UserController } from '@presentation/default/user/user.controller';

@Module({
  imports: [UsecaseProxyModule.register()],
  providers: [],
  controllers: [PartnerController, UserController],
})
export class DefaultModule {}
