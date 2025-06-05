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

export const EDIT_REVIEW_CONFIG = (
    token: string,
    rating: string,
    text: string,
    reviewId: string,
    photos: string[] = [],
    newPhotos: string[] = [],
) => {
    const formData = new FormData2();

    photos.push(...newPhotos);
    formData.append('rating', rating);
    formData.append('text', text);
    formData.append('photos', photos.join(','));
    formData.append('new_photos', newPhotos.join(','));
    formData.append('fields', 'reviews.hiding_reason');

    return {
        requestConfig: {
            url: `https://public-api.reviews.2gis.com/2.0/reviews/${reviewId}?key=b0209295-ae15-48b2-acb2-58309b333c37&locale=ru_KZ`,
            method: REQUEST_METHOD.PATCH,
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

export const SAVE_IMAGE_CONFIG = (token: string, image: Buffer) => {
    const formData = new FormData2();

    formData.append('images[]', image, getFileName());

    return {
        requestConfig: {
            method: REQUEST_METHOD.POST,
            url: 'https://public-api.reviews.2gis.com/2.0/photos?key=b0209295-ae15-48b2-acb2-58309b333c37&locale=ru_KZ',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type':
                    'multipart/form-data; boundary=----WebKitFormBoundarylmxMVBzYhJ18HSD5',
            },
            data: formData,
            timeout: 45000,
        },
        localConfig: {
            responseType: RESPONSE_TYPE.DATA,
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
    accessToken: string,
    reviewExternalId: string | number,
) => {
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
