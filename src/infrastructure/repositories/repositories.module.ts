import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { REPOSITORIES } from '.';
import { EnvConfigModule } from '../config/env-config/env-config.module';
import { TypeOrmConfigModule } from '../config/orm/typeorm.module';
import { ORGANIZATION_ENTITIES } from 'src/infrastructure/entities/organization';
import { PARTNER_ENTITIES } from 'src/infrastructure/entities/ partner';
import { REVIEW_ENTITIES } from 'src/infrastructure/entities/review';
import { RepositoriesService } from 'src/infrastructure/repositories/repositories.service';
import { RequestModule } from 'src/infrastructure/services/request/request.module';
import { USER_ENTITIES } from '@infrastructure/entities/user';

@Module({
  imports: [
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([
      ...ORGANIZATION_ENTITIES,
      ...PARTNER_ENTITIES,
      ...REVIEW_ENTITIES,
      ...USER_ENTITIES,
    ]),
    forwardRef(() => RequestModule),
    EnvConfigModule,
  ],
  providers: [RepositoriesService, ...REPOSITORIES],
  exports: [RepositoriesService, ...REPOSITORIES],
})
export class RepositoriesModule {}
