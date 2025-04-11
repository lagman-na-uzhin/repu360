export enum ERR_REQUEST {
    UNKNOWN = 'ERR_REQUEST_UNKNOWN',
    TIMEOUT = 'ERR_REQUEST_TIMEOUT',
    EXTERNAL_AUTH = 'ERR_REQUEST_EXTERNAL_AUTH',
    NOT_FOUND = 'ERR_REQUEST_NOT_FOUND',
    INVALID_GRANT = 'emailINVALID_BODY_DATA', // Если не существует аккаунта или body с ошибкой
    YOU_MUST_EDIT_NOT_SEND = 'YOU MUST EDIT, NOT SEND REVIEW',
}

export enum RESPONSE_TYPE {
    DATA = 'data',
    COOKIE = 'cookie',
    RES = 'res',
    LOGIN_GET_NAME = 'getnameandlogin',
}

export enum REQUEST_METHOD {
    GET = 'GET',
    POST = 'POST',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
    PUT = 'PUT',
}
