import {DecoderResultDto} from "@application/interfaces/services/geocoder/dto/decoder-result.dto";

export interface IGeocoderService {
    decoder(  latitude: number,longitude: number ):Promise<DecoderResultDto>
}
