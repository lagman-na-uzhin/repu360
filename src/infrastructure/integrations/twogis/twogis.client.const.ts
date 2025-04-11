import {RequestDto} from "src/infrastructure/services/request/request.dto";
import {
    GetOrganizationReviewsInDto
} from "@application/interfaces/integrations/twogis/client/dto/in/get-organization-reviews.in.dto";
import {REQUEST_METHOD, RESPONSE_TYPE} from "@application/interfaces/services/request/request.enum";

export const GET_ORGANIZATION_REVIEWS_CONFIG = (
    id: string,
    payload: GetOrganizationReviewsInDto,
): RequestDto => {
    const { type, limit, isRated } = payload;

    const requestType = type === 'branch' ? 'branch' : 'geo';
    const params: Record<string, any> = {
        limit,
        fields: `meta.providers,meta.${requestType}_rating,meta.${requestType}_reviews_count,meta.total_count,reviews.hiding_reason,reviews.is_verified`,
        without_my_first_review: false,
        sort_by: 'date_edited',
        key: 'b0209295-ae15-48b2-acb2-58309b333c37',
        locale: 'ru_KZ',
    };

    if (typeof isRated === 'boolean') {
        params.rated = isRated;
        params.is_advertiser = isRated;
    }

    const pathType = type === 'branch' ? 'branches' : 'geo';
    const url = `https://public-api.reviews.2gis.com/2.0/${pathType}/${id}/reviews`;

    return {
        requestConfig: {
            url,
            method: REQUEST_METHOD.GET,
            params,
            headers: {
                Accept: '*/*',
                Origin: 'https://2gis.kz',
                Referer: 'https://2gis.kz/',
            },
        },
        localConfig: {
            responseType: RESPONSE_TYPE.DATA,
        },
    };
};

export const GET_ORGANIZATION_REVIEWS_NEXT_CONFIG = (url: string) => {
    return {
        requestConfig: {
            url,
            method: REQUEST_METHOD.GET,
            headers: {
                Accept: '*/*',
                Origin: 'https://2gis.kz',
                Referer: 'https://2gis.kz/',
            },
        },
        localConfig: {
            responseType: RESPONSE_TYPE.DATA,
        },
    };
};
