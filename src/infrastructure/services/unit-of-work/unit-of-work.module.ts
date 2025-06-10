import { Module } from '@nestjs/common';
import {UnitOfWork} from "@infrastructure/services/unit-of-work/unit-of-work.service";

@Module({
  imports: [],
  providers: [UnitOfWork],
  exports: [UnitOfWork],
})
export class UnitOfWorkModule {}
