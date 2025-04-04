import { forwardRef, Module } from '@nestjs/common';
import { RepositoriesModule } from 'src/infrastructure/repositories/repositories.module';
import { RequestService } from './request.service';

@Module({
  imports: [forwardRef(() => RepositoriesModule)],
  providers: [RequestService],
  exports: [RequestService],
})
export class RequestModule {}
