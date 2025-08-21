export enum TYPE_ENV {
    FACE = 'FACE',

    AUTO_REPLY = 'AUTO_REPLY',


    REVIEW_SYNC = 'REVIEW_SYNC',

    MAILER = 'MAILER'
}

const productionNodeEnvs = ['prod', 'PROD', 'production'];
const devInitTypes = process.env.DEV_INIT_TYPES?.split(' ');

const devInitTypesCheck = (type: TYPE_ENV) => {
    if (!process.env.NODE_ENV) return false;
    if (productionNodeEnvs.includes(process.env.NODE_ENV)) return false;

    if (!process.env.DEV_INIT_TYPES) return false;
    if (process.env.NODE_ENV === 'dev' && devInitTypes?.includes(type))
        return true;
};

export const isInitTypeEnv = (type: TYPE_ENV, checkDev = true) => {
    if (checkDev && devInitTypesCheck(type)) return true;
    return process.env.TYPE_ENV === type;
};
