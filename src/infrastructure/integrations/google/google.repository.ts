import {RequestService} from "@infrastructure/services/request/request.service";
import {IGoogleRepository} from "@application/interfaces/integrations/google/google.repository.interface";
import {SEARCH_PLACES_BY_TEXT} from "@infrastructure/integrations/google/google.client.const";
import {EnvConfigService} from "@infrastructure/config/env-config/env-config.service";

export class GoogleRepository implements IGoogleRepository {
    constructor(
        private readonly requestService: RequestService,
        private readonly configService: EnvConfigService,
    ) {}

    async searchPlaces(text: string): Promise<any> {
        return this.requestService.request(
            SEARCH_PLACES_BY_TEXT(text, this.configService.getGoogleApiKey()),
            null,
            1
        );
    }
}
