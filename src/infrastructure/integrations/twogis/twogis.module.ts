import { Module } from '@nestjs/common';
import {UnitOfWork} from "@infrastructure/services/unit-of-work/unit-of-work.service";
import {TwogisSession} from "@infrastructure/integrations/twogis/twogis.session";

@Module({
    imports: [],
    providers: [TwogisSession],
    exports: [TwogisSession],
})
export class TwogisModule {}
