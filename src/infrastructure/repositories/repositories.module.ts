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
import {AUTO_REPLY_ENTITIES} from "@infrastructure/entities/autoreply";
import {PLACEMENT_ENTITIES} from "@infrastructure/entities/placement";
import {PROFILE_ENTITIES} from "@infrastructure/entities/profile";
import {PROXY_ENTITIES} from "@infrastructure/entities/proxy";
import {SUBSCRIPTION_ENTITIES} from "@infrastructure/entities/subscription";
import {TARIFF_ENTITIES} from "@infrastructure/entities/tariff";
import {LEAD_ENTITIES} from "@infrastructure/entities/lead";
import {RequestService} from "@infrastructure/services/request/request.service";

@Module({
  imports: [
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([
      ...ORGANIZATION_ENTITIES,
      ...COMPANY_ENTITIES,
      ...REVIEW_ENTITIES,
      ...USER_ENTITIES,
        ...AUTO_REPLY_ENTITIES,
        ...PLACEMENT_ENTITIES,
        ...PROFILE_ENTITIES,
        ...PROXY_ENTITIES,
        ...SUBSCRIPTION_ENTITIES,
        ...TARIFF_ENTITIES,
        ...LEAD_ENTITIES
    ]),
    forwardRef(() => RequestModule),
    EnvConfigModule,
  ],
  providers: [
    BaseRepository,
      RequestService,
    ...REPOSITORIES,
  ],
  exports: [BaseRepository, ...REPOSITORIES],
})
export class RepositoriesModule {}
