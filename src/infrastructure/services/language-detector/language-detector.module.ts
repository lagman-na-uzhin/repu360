import { Module } from '@nestjs/common';
import { LanguageDetectorService } from './language-detector.service';

@Module({
  imports: [],
  providers: [LanguageDetectorService],
  exports: [LanguageDetectorService],
})
export class LanguageDetectorServiceModule {}
