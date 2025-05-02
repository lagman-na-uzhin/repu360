import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { REPOSITORIES } from '.';
import { EnvConfigModule } from '../config/env-config/env-config.module';
import { TypeOrmConfigModule } from '../config/orm/typeorm.module';
import { ORGANIZATION_ENTITIES } from 'src/infrastructure/entities/organization';
import { COMPANY_ENTITIES } from 'src/infrastructure/entities/company';
import { REVIEW_ENTITIES } from 'src/infrastructure/entities/review';
import { RequestModule } from 'src/infrastructure/services/request/request.module';
import { USER_ENTITIES } from '@infrastructure/entities/user';
import { BaseRepository } from '@infrastructure/repositories/base-repository';

@Module({
  imports: [
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([
      ...ORGANIZATION_ENTITIES,
      ...COMPANY_ENTITIES,
      ...REVIEW_ENTITIES,
      ...USER_ENTITIES,
    ]),
    forwardRef(() => RequestModule),
    EnvConfigModule,
  ],
  providers: [
    BaseRepository,
    ...REPOSITORIES,
  ],
  exports: [BaseRepository, ...REPOSITORIES],
})
export class RepositoriesModule {}
