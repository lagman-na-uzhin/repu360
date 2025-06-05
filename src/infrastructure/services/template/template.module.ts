import { Module } from '@nestjs/common';
import { TemplateService } from './template.service';

@Module({
  imports: [],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateServiceModule {}
