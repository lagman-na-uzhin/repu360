export interface DecoderResultDto {
    features: [
        {
            properties: {
                country: string;
                country_code: string;
                city: string;
                postcode: string;
                district: string;
                suburb: string;
                street: string;
                housenumber: string;
                iso3166_2: string;
                lon: number;
                lat: number;
                distance: number;
                result_type: string;
                county: string;
                state: string;
                state_code: string;
                county_code: string;
                formatted: string;
                address_line1: string;
                address_line2: string;
                category: string;
                timezone: {
                    name: string;
                    offset_STD: string;
                    offset_STD_seconds: number;
                    offset_DST: string;
                    offset_DST_seconds: number;
                };
                plus_code: string;
                plus_code_short: string;

            }
        }
    ]
}
