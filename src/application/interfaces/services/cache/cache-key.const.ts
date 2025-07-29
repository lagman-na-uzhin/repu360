export const CACHE_KEY = {
    COMMON: {
        AUTH_TOKEN: (userId: string): string => `USER_AUTH_TOKEN_${userId}`,
        MULTIPLE_AUTH_TOKEN: (ownerUserId: string, userId: string): string => `MULTIPLE_AUTH_TOKEN_${ownerUserId}_${userId}`
    },
    EMPLOYEE: {
    },
    MANAGER: {
    }
}
