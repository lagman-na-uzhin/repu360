import { forwardRef, Module } from '@nestjs/common';
import { RepositoriesModule } from 'src/infrastructure/repositories/repositories.module';
import { RequestService } from './request.service';
import {ProxyService} from "@infrastructure/services/request/proxy.service";

@Module({
  imports: [forwardRef(() => RepositoriesModule)],
  providers: [RequestService, ProxyService],
  exports: [RequestService, ProxyService],
})
export class RequestModule {}
