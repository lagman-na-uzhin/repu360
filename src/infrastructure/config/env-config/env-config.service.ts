import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ICacheConfig,
  IDatabaseConfig, IImapConfig,
  IJwtConfig,
  IMailerConfig, IOpenAIConfig,
} from '@infrastructure/config/interfaces/env-config.interface';


@Injectable()
export class EnvConfigService
  implements
    IDatabaseConfig,
    ICacheConfig,
    IJwtConfig,
    IMailerConfig,
    IImapConfig,
    IOpenAIConfig
{
  constructor(private configService: ConfigService) {}
  /* JWT */
  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET') || '';
  }

  getJwtExpirationTime(): string {
    return this.configService.get<string>('JWT_EXPIRATION_TIME') || '';
  }

  getJwtRefreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET') || '';
  }

  getJwtRefreshExpirationTime(): string {
    return (
        this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME') || ''
    );
  }

  /* DATABASE */
  getDatabaseHost(): string {
    return this.configService.get<string>('DATABASE_HOST') || 'localhost';
  }

  getDatabasePort(): number {
    return this.configService.get<number>('DATABASE_PORT') || 5432;
  }

  getDatabaseUser(): string {
    return this.configService.get<string>('DATABASE_USER') || 'postgres';
  }

  getDatabasePassword(): string {
    return this.configService.get<string>('DATABASE_PASSWORD') || '';
  }

  getDatabaseName(): string {
    return this.configService.get<string>('DATABASE_NAME') || 'demetra';
  }

  getDatabaseSchema(): string {
    return this.configService.get<string>('DATABASE_SCHEMA') || 'public';
  }

  getDatabaseSync(): boolean {
    const value =
        this.configService.get<string>('DATABASE_SYNCHRONIZE') || null;
    const result = value === 'enabled';
    return result;
  }

  /* CACHE */
  getCacheHost(): string {
    return this.configService.get<string>('CACHE_HOST') || 'localhost';
  }

  getCachePort(): number {
    return this.configService.get<number>('CACHE_PORT') || 6379;
  }

  getCachePassword(): string {
    return this.configService.get<string>('CACHE_PASSWORD') || '';
  }

  /* CACHE BULL */
  getBullCacheHost(): string {
    return this.configService.get<string>('BULL_CACHE_HOST') || 'localhost';
  }

  getBullCachePort(): number {
    return this.configService.get<number>('BULL_CACHE_PORT') || 6379;
  }

  getBullCachePassword(): string {
    return this.configService.get<string>('BULL_CACHE_PASSWORD') || '';
  }

  /* MAILER */
  getMailerHost(): string {
    return this.configService.get<string>('MAILER_HOST') || '';
  }

  getMailerPort(): number {
    return this.configService.get<number>('MAILER_PORT') || 465;
  }

  getMailerUser(): string {
    return this.configService.get<string>('MAILER_USER') || '';
  }

  getMailerPassword(): string {
    return this.configService.get<string>('MAILER_PASSWORD') || '';
  }

  /* IMAP */
  getImapUserMailPrefix(): string {
    return this.configService.get<string>('IMAP_MAIL_PREFIX') || '';
  }

  getImapUserMailSuffix(): string {
    return this.configService.get<string>('IMAP_MAIL_SUFFIX') || '';
  }

  getImapHost(): string {
    return this.configService.get<string>('IMAP_HOST') || '';
  }

  getImapPort(): number {
    return this.configService.get<number>('IMAP_PORT') || 993;
  }

  getImapMail(): string {
    return this.configService.get<string>('IMAP_MAIL') || '';
  }

  getImapPassword(): string {
    return this.configService.get<string>('IMAP_PASSWORD') || '';
  }

  /* OPENAI */
  getOpenAIApiKey(): string {
    return this.configService.get<string>('OPENAI_API_KEY') || '';
  }

  // WHATSAPP
  getWhatsappApiKey(): string {
    return this.configService.get<string>('WHATSAPP_API_KEY') || '';
  }


  //GOOGLE
  getGoogleApiKey(): string {
    return this.configService.get<string>('GOOGLE_API_KEY') || '';
  }
 }
