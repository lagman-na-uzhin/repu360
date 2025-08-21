import { Module } from '@nestjs/common';
import { EnvConfigModule } from '../../config/env-config/env-config.module';
import { MailerService } from './mailer.service';

@Module({
    imports: [EnvConfigModule],
    providers: [MailerService],
    exports: [MailerService],
})
export class MailerModule {}
