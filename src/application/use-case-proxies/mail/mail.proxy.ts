import { ProxyPrefix } from '@application/use-case-proxies/proxy-prefix';

export const MailProxy = {
    "SEND_MAIL_PROCESS": `${ProxyPrefix.MAIL_PROXY}SendMailProcessUseCase`,
} as const;

export const mailProxyExports = [
    MailProxy.SEND_MAIL_PROCESS,
]
