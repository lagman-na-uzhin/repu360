export interface IDatabaseConfig {
  getDatabaseHost(): string;
  getDatabasePort(): number;
  getDatabaseUser(): string;
  getDatabasePassword(): string;
  getDatabaseName(): string;
  getDatabaseSchema(): string;
  getDatabaseSync(): boolean;
}
export interface ICacheConfig {
  getCacheHost(): string;
  getCachePort(): number;
  getCachePassword(): string;
}
export interface IJwtConfig {
  getJwtSecret(): string;
  getJwtExpirationTime(): string;
  getJwtRefreshSecret(): string;
  getJwtRefreshExpirationTime(): string;
}
export interface IMailerConfig {
  getMailerHost(): string;
  getMailerPort(): number;
  getMailerUser(): string;
  getMailerPassword(): string;
}
export interface IImapConfig {
  getImapUserMailPrefix(): string;
  getImapUserMailSuffix(): string;
  getImapHost(): string;
  getImapPort(): number;
  getImapMail(): string;
  getImapPassword(): string;
}
export interface IOpenAIConfig {
  getOpenAIApiKey(): string;
}
