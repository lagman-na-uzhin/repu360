import {Module} from "@nestjs/common";
import {GeocoderService} from "@infrastructure/services/geocoder/geocoder.service";
import {EnvConfigModule} from "@infrastructure/config/env-config/env-config.module";
import {RequestModule} from "@infrastructure/services/request/request.module";

@Module({
    imports: [RequestModule, EnvConfigModule],
    providers: [GeocoderService],
    exports: [GeocoderService],
})
export class GeocoderServiceModule {}
