import {RequestDto} from "src/infrastructure/services/request/request.dto";
import * as FormData2 from 'form-data';
import {
    GetOrganizationReviewsInDto
} from "@application/interfaces/integrations/twogis/client/dto/in/get-organization-reviews.in.dto";
import {REQUEST_METHOD, RESPONSE_TYPE} from "@application/interfaces/services/request/request.enum";
import {extname} from "path";

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


export const GET_ORGANIZATION_BRANCH = (
    accessToken: string,
    branchId: string,
) => {
    return {
        requestConfig: {
            url: `https://api.account.2gis.com/api/1.0/branches/${branchId}`,
            method: REQUEST_METHOD.GET,
            headers: {
                Accept: '*/*',
                Origin: 'https://2gis.kz',
                Referer: 'https://2gis.kz/',
                Authorization: `Bearer ${accessToken}`,
            },
        },
        localConfig: {
            responseType: RESPONSE_TYPE.DATA,
        },
    };
};

export const AUTH_BASIC_CONFIG = (email: string, password: string) => {
    const grant_type = 'password';
    const locale = 'ru-KZ';
    return {
        requestConfig: {
            url: 'https://id.2gis.com/api/v1/sign_in',
            method: REQUEST_METHOD.POST,
            data: {
                grant_type,
                locale,
                username: email,
                password,
            },
            headers: {
                Accept: '*/*',
                Origin: 'https://2gis.kz',
                Referer: 'https://2gis.kz/',
            },
        },
        localConfig: {
            responseType: RESPONSE_TYPE.COOKIE,
        },
    };
};

export const AUTH_BASIC_WITH_NAME_CONFIG = (
    email: string,
    password: string,
) => {
    const grant_type = 'password';
    const locale = 'ru-KZ';
    return {
        requestConfig: {
            url: 'https://id.2gis.com/api/v1/sign_in',
            method: REQUEST_METHOD.POST,
            data: {
                grant_type,
                locale,
                username: email,
                password,
            },
            headers: {
                Accept: '*/*',
                Origin: 'https://2gis.kz',
                Referer: 'https://2gis.kz/',
            },
        },
        localConfig: {
            responseType: RESPONSE_TYPE.LOGIN_GET_NAME,
        },
    };
};

export const SEND_REVIEW_CONFIG = (
    token: string,
    objectId: string,
    objectType: string,
    rating: string,
    imagesId: string[],
    text?: string,
) => {
    const formData = new FormData2();

    formData.append('object_id', objectId);
    formData.append('object_type', objectType === 'branch' ? 'branch' : 'geo');
    formData.append('rating', rating);
    if (text) {
        formData.append('text', text);
    }
    formData.append('fields', 'reviews.hiding_reason');
    if (imagesId.length) {
        formData.append('photo_ids', imagesId.join(','));
    }

    return {
        requestConfig: {
            url: 'https://public-api.reviews.2gis.com/2.0/reviews?key=b0209295-ae15-48b2-acb2-58309b333c37&locale=ru_KZ',
            method: REQUEST_METHOD.POST,
            data: formData,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: '*/*',
                Origin: 'https://2gis.kz',
                Referer: 'https://2gis.kz/',
                ...formData.getHeaders(),
            },
            timeout: 120000,
        },
        localConfig: {
            responseType: RESPONSE_TYPE.RES,
        },
    };
};

export const SEARCH_RUBRICS_CONFIG = (
    token: string,
    query: string,
) => {
    return {
        requestConfig: {
            url: `https://api.account.2gis.com/api/1.0/regions/67/rubrics/search?q=${query}`,
            method: REQUEST_METHOD.GET,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: '*/*',
                Origin: 'https://account.2gis.com',
                Referer: 'https://account.2gis.com/',
            },
        },
        localConfig: {
            responseType: RESPONSE_TYPE.RES,
        },
    };
};


export const SET_AVATAR_FIRST_CONFIG = (token: string, externalId: string) => {
    const formData3 = new FormData2();

    formData3.append('key', 'Cugh6ahW');
    formData3.append('object_id', `${externalId}`);
    formData3.append('object_type', 'profile');
    formData3.append('album_code', 'avatar');
    formData3.append('locale', 'ru_KZ');
    formData3.append('region_id', '67');
    formData3.append('items[0][uid]', '36787300-b23a-4ee2-88c2-aec9125bd48e');
    formData3.append('replace', 'true');

    return {
        requestConfig: {
            method: REQUEST_METHOD.POST,
            url: `https://api.photo.2gis.com/2.0/photo/add`,
            headers: {
                'Auth-Token': token,
                ...formData3.getHeaders(),
            },
            data: formData3,
        },
        localConfig: {
            responseType: RESPONSE_TYPE.DATA,
        },
    };
};

export const SET_AVATAR_SECOND_CONFIG = (
    uniq: string,
    hash: string,
    image: Buffer,
    token: string,
) => {
    const formData4 = new FormData2();

    formData4.append('key', 'Cugh6ahW');
    formData4.append('items[0][id]', `${uniq}`);
    formData4.append('items[0][hash]', `${hash}`);
    formData4.append('items[0][file]', image, { filename: getFileName() });
    formData4.append(
        'preview_size',
        '656x340,328x170,232x232,176x176,116x116,88x88',
    );

    return {
        requestConfig: {
            method: REQUEST_METHOD.POST,
            url: `https://api.photo.2gis.com/2.0/photo/upload`,
            headers: {
                'Auth-Token': token,
                'Content-Type':
                    'multipart/form-data; boundary=----WebKitFormBoundaryyVIAOUFhV274cYPr',
                ...formData4.getHeaders(),
            },
            data: formData4,
        },
        localConfig: {
            responseType: RESPONSE_TYPE.DATA,
        },
    };
};

export const SET_AVATAR_THIRD_CONFIG = (token: string, url: string) => {
    const formData3 = new FormData2();

    formData3.append('avatar', url);

    return {
        requestConfig: {
            method: REQUEST_METHOD.PATCH,
            url: `https://api.auth.2gis.com/2.1/users/me?locale=ru_KZ&client_id=VDEDqs4X9Rn2cz3FbBqFnFmhVdn76fN8&access_token=${token}`,
            headers: {
                ...formData3.getHeaders(),
            },
            data: formData3,
        },
        localConfig: {
            responseType: RESPONSE_TYPE.DATA,
        },
    };
};

export const GET_USER_INFO = (token: string) => {
    return {
        requestConfig: {
            method: REQUEST_METHOD.GET,
            url: `https://api.auth.2gis.com/2.1/users/me?access_token=${token}`,
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

export const GET_PUBLIC_USER_INFO = (publicUserId: string) => {
    return {
        requestConfig: {
            method: REQUEST_METHOD.GET,
            url: `https://api.auth.2gis.com/public-profile/user/${publicUserId}`,
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

export const GET_BY_ID_ORG = (externalId: string) => {
    const fields = [
        "items.point",
        "items.address",
        "items.adm_div",
        "items.full_address_name",
        "items.geometry.centroid",
        "items.geometry.hover",
        "items.geometry.selection",
        "items.rubrics",
        "items.org",
        "items.brand",
        "items.schedule",
        "items.schedule_special",
        "items.access_comment",
        "items.access",
        "items.capacity",
        "items.description",
        "items.flags",
        "items.is_paid",
        "items.for_trucks",
        "items.paving_type",
        "items.is_incentive",
        "items.purpose",
        "items.level_count",
        "items.links",
        "items.links.nearest_platforms",
        "items.links.attractions",
        "items.links.on_territory",
        "items.links.airports",
        "items.links.parking",
        "items.links.river_ports",
        "items.links.entrances",
        "items.links.providers",
        "items.links.branches",
        "items.links.servicing",
        "items.links.nearest_parking",
        "items.links.hotels",
        "items.links.nearest_stations",
        "items.links.bus_terminals",
        "items.links.seaports",
        "items.links.railway_terminals",
        "items.links.nearest_metro",
        "items.links.landmarks",
        "items.name_ex",
        "items.reviews",
        "items.statistics",
        "items.has_apartments_info",
        "items.is_deleted",
        "items.hash",
        "items.ads.options",
        "items.attribute_groups",
        "items.context",
        "items.dates.deleted_at",
        "items.dates.updated_at",
        "items.dates.created_at",
        "items.geometry.style",
        "items.group",
        "items.metarubrics",
        "items.delivery",
        "items.has_goods",
        "items.has_pinned_goods",
        "items.has_realty",
        "items.has_audiogid",
        "items.has_discount",
        "items.has_exchange",
        "items.is_main_in_group",
        "items.city_alias",
        "items.detailed_subtype",
        "items.alias",
        "items.caption",
        "items.is_promoted",
        "items.routes",
        "items.directions",
        "items.barrier",
        "items.is_routing_available",
        "items.entrance_display_name",
        "items.locale",
        "items.reg_bc_url",
        "items.region_id",
        "items.segment_id",
        "items.stat",
        "items.stop_factors",
        "items.timezone",
        "items.timezone_offset",
        "items.comment",
        "items.station_id",
        "items.platforms",
        "items.sources",
        "items.route_logo",
        "items.order_with_cart",
        "items.congestion",
        "items.poi_category",
        "items.has_dynamic_congestion",
        "items.temporary_unavailable_atm_services",
        "items.marker_alt",
        "items.floor_id",
        "items.purpose_code",
        "items.name_back",
        "items.value_back",
        "items.ev_charging_station",
        "items.ski_lift",
        "items.has_ads_model",
        "items.has_otello_stories"
    ].join(',');
    const key = '142be1a7-aa84-4b5b-9a8d-1c05f09d518d'

    console.log(fields, "fields")
    return {
        requestConfig: {
            method: REQUEST_METHOD.GET,
            url: `https://catalog.api.2gis.com/3.0/items/byid?id=${externalId}&locale=ru_RU&fields=${fields}&key=${key}`,
            headers: {
                Accept: 'application/json, text/plain, */*',
            },
        },
        localConfig: {
            responseType: RESPONSE_TYPE.DATA,
        },
    }
}

export const ACCOUNT_2GIS_AUTH = (username: string, password: string) => {
    return {
        requestConfig: {
            method: REQUEST_METHOD.POST,
            url: `https://api.account.2gis.com/api/1.0/users/auth`,
            headers: {
                Accept: 'application/json, text/plain, */*',
                Origin: 'https://account.2gis.com',
                Referer: 'https://account.2gis.com/',
            },
            data: {
                login: username,
                password: password,
            },
        },
        localConfig: {
            responseType: RESPONSE_TYPE.DATA,
        },
    };
};

export const SEND_REVIEW_REPLY_CONFIG = (
    token: string,
    text: string,
    reviewExternalId: string | number,
) => {
    return {
        requestConfig: {
            method: REQUEST_METHOD.POST,
            url: `https://api.account.2gis.com/api/1.0/presence/reviews/${reviewExternalId}/comments`,
            headers: {
                Accept: 'application/json, text/plain, */*',
                Origin: 'https://account.2gis.com',
                Referer: 'https://account.2gis.com/',
                Authorization: `Bearer ${token}`,
            },
            data: {
                text,
                catalog: '2gis',
                isOfficialAnswer: false,
            },
        },
        localConfig: {
            responseType: RESPONSE_TYPE.DATA,
        },
    };
};


export const GENERATE_REVIEW_REPLY_CONFIG = (
    token: string,
    reviewerName: string,
) => {
    return {
        requestConfig: {
            method: REQUEST_METHOD.POST,
            url: `https://api.account.2gis.com/api/1.0/review/generateComment`,
            headers: {
                Accept: 'application/json, text/plain, */*',
                Origin: 'https://account.2gis.com',
                Referer: 'https://account.2gis.com/',
                Authorization: `Bearer ${token}`,
            },
            data: {
                language: 'ru',
                name: reviewerName,
            },
        },
        localConfig: {
            responseType: RESPONSE_TYPE.DATA,
        },
    };
};

export const GET_REVIEW_ANSWERS_CONFIG = (
    accessToken: string,
    reviewExternalId: string | number,
) => {
    return {
        requestConfig: {
            method: REQUEST_METHOD.GET,
            url: `https://api.account.2gis.com/api/1.0/presence/reviews/${reviewExternalId}/comments?catalog=2gis&limit=1`,
            headers: {
                Accept: 'application/json, text/plain, */*',
                Origin: 'https://account.2gis.com',
                Referer: 'https://account.2gis.com/',
                Authorization: `Bearer ${accessToken}`,
            },
        },
        localConfig: {
            responseType: RESPONSE_TYPE.DATA,
        },
    };
};

export const GET_REVIEW_CONFIG = (
    reviewExternalId: string | number,
    accessToken: string
) => {
    console.log(accessToken, "accessToken GET_REVIEW_CONFIG")
    console.log(reviewExternalId, "reviewExternalId GET_REVIEW_CONFIG")
    return {
        requestConfig: {
            method: REQUEST_METHOD.GET,
            url: `https://api.account.2gis.com/api/1.0/presence/reviews/${reviewExternalId}?catalog=2gis`,
            headers: {
                Accept: 'application/json, text/plain, */*',
                Origin: 'https://account.2gis.com',
                Referer: 'https://account.2gis.com/',
                Authorization: `Bearer ${accessToken}`,
            },
        },
        localConfig: {
            responseType: RESPONSE_TYPE.DATA,
        },
    };
};

export const DELETE_REVIEW_CONFIG = (token: string, reviewId: string) => {
    const formData = new FormData2();

    formData.append('id', reviewId);
    formData.append('fields', 'reviews.hiding_reason');

    return {
        requestConfig: {
            url: `https://public-api.reviews.2gis.com/2.0/reviews/${reviewId}?key=b0209295-ae15-48b2-acb2-58309b333c37&locale=ru_KZ`,
            method: REQUEST_METHOD.DELETE,
            data: formData,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: '*/*',
                Origin: 'https://2gis.kz',
                Referer: 'https://2gis.kz/',

                ...formData.getHeaders(),
            },
        },
        localConfig: {
            responseType: RESPONSE_TYPE.RES,
        },
    };
};

export const CHANGE_USER_CREDENTIALS = (
    accessToken: string,
    firstName: string,
    lastName: string,
) => {
    const formData = new FormData2();

    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    return {
        requestConfig: {
            url: `https://api.auth.2gis.com/2.1/users/me?access_token=${accessToken}`,
            method: REQUEST_METHOD.PATCH,
            data: formData,
            headers: {
                Accept: '*/*',
                Origin: 'https://2gis.kz',
                Referer: 'https://2gis.kz/',

                ...formData.getHeaders(),
            },
        },
        localConfig: {
            responseType: RESPONSE_TYPE.RES,
        },
    };
};


export const DELETE_OFFICIAL_ANSWER_CONFIG = (
    token: string,
    reviewExternalId: string,
    replyExternalId: string,
) => {
    return {
        requestConfig: {
            method: REQUEST_METHOD.DELETE,
            url: `https://api.account.2gis.com/api/1.0/presence/reviews/${reviewExternalId}/comments/${replyExternalId}?catalog=2gis&type=reply`,
            headers: {
                Accept: 'application/json, text/plain, */*',
                Origin: 'https://account.2gis.com',
                Referer: 'https://account.2gis.com/',
                Authorization: `Bearer ${token}`,
            },
        },
        localConfig: {
            responseType: RESPONSE_TYPE.RES,
        },
    };
};

export const RESTORE_PROFILE_PASSWORD = (email: string) => {
    const params = new URLSearchParams();
    params.append('grant_type', 'email');
    params.append('email', email);

    return {
        requestConfig: {
            url: `https://api.auth.2gis.com/2.1/users/recovery?client_id=v4-iphone&locale=ru_KZ`,
            method: REQUEST_METHOD.POST,
            data: params,
            headers: {
                Accept: '*/*',
                Origin: 'https://2gis.kz',
                Referer: 'https://2gis.kz/',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        },
        localConfig: {
            responseType: RESPONSE_TYPE.RES,
        },
    };
};

export const SEND_COMPLAINT = (
    accessToken: string,
    reviewExternalId: string,
    text: string,
    isNoClientComplaint: boolean = true,
) => {
    return {
        requestConfig: {
            url: `https://api.account.2gis.com/api/1.0/presence/reviews/${reviewExternalId}/complaints`,
            method: REQUEST_METHOD.POST,
            data: {
                catalog: '2gis',
                isNoClientComplaint,
                text,
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json, text/plain, */*',
                Origin: 'https://account.2gis.com',
                Referer: 'https://account.2gis.com/',
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
            },
        },
        localConfig: {
            responseType: RESPONSE_TYPE.RES,
        },
    };
};

export const GET_COMPLAINTS = (
    accessToken: string,
    reviewExternalId: string,
) => {
    return {
        requestConfig: {
            url: `https://public-api.reviews.2gis.com/2.0/reviews/${reviewExternalId}/complaints?key=91164137-a2be-462d-9d2a-d6720e82c443`,
            method: REQUEST_METHOD.GET,
            headers: {
                Accept: 'application/json, text/plain, */*',
                Origin: 'https://account.2gis.com',
                Referer: 'https://account.2gis.com/',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        },
        localConfig: {
            responseType: RESPONSE_TYPE.RES,
        },
    };
};

export const GET_RATINGS_CONFIG = (oranizationExternalId: string) => {
    return {
        requestConfig: {
            url: `https://public-api.reviews.2gis.com/2.0/objects/${oranizationExternalId}/ratings?key=6e7e1929-4ea9-4a5d-8c05-d601860389bd`,
            method: REQUEST_METHOD.GET,
            headers: {
                Accept: 'application/json, text/plain, */*',
                AcceptLanguage: 'en-GB,en-US;q=0.9,en;q=0.8',
                Origin: 'https://2gis.kz',
                Priority: 'u=1, i',
                Referer: 'https://2gis.kz/',
                secChUa: '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
                SecChUaMobile: '?0',
                SecChUaPlatform: '"macOS"',
                SecFetchDest: 'empty',
                SecFetchMode: 'cors',
                SecFetchSite: 'cross-site',
            },
        },
        localConfig: {
            responseType: RESPONSE_TYPE.DATA,
        }
    }
}

function getFileName() {
    return `${Math.round(new Date().getTime() / 1000)}${extname('image')}`;
}
