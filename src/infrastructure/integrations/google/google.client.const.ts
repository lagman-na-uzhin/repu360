import {REQUEST_METHOD, RESPONSE_TYPE} from "@application/interfaces/services/request/request.enum";

export const SEARCH_PLACES_BY_TEXT = (text: string, key: string) => {
    return {
        requestConfig: {
            method: REQUEST_METHOD.GET,
            url: `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${text}&key=${key}`,
            headers: {
                Origin: 'https://2gis.kz',
                Referer: 'https://2gis.kz/',
            },
        },
        localConfig: {
            responseType: RESPONSE_TYPE.DATA,
        },
    };
};
