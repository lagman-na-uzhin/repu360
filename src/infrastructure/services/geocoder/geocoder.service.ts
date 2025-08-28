import {IGeocoderService} from "@application/interfaces/services/geocoder/geocoder-service.interface";
import {Injectable} from "@nestjs/common";
import {DecoderResultDto} from "@application/interfaces/services/geocoder/dto/decoder-result.dto";
import {RequestService} from "@infrastructure/services/request/request.service";
import {GET_DECODED_INFO} from "@infrastructure/services/geocoder/geocoder.const";
import {EnvConfigService} from "@infrastructure/config/env-config/env-config.service";

@Injectable()
export class GeocoderService implements IGeocoderService {
    private readonly key: string;
    constructor(
        private readonly requestService: RequestService,
        private readonly envConfigService: EnvConfigService,
    ) {
        this.key = this.envConfigService.getgGoapifyApiKey();
    }

    async decoder(latitude: number, longitude: number): Promise<DecoderResultDto> {
        return this.requestService.request(GET_DECODED_INFO(this.key, latitude, longitude), null, 1);
    }
}
