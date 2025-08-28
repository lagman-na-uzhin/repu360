import {REQUEST_METHOD, RESPONSE_TYPE} from "@application/interfaces/services/request/request.enum";

export const GET_DECODED_INFO = (
    key: string,
    lat: number,
    lon: number,
) => {
    return {
        requestConfig: {
            url: `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${key}`,
            method: REQUEST_METHOD.GET,
            headers: {
                Accept: 'application/json, text/plain, */*',
            },
            localConfig: {
                responseType: RESPONSE_TYPE.DATA,
            }
        }
    }
}
