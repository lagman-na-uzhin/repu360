export interface IJwtServicePayload {
  authId: string;
  authPartnerId: string | null;
  authRole: string;
  ownerId: number;
  permission?: object;
}

export interface IJwtService {
  checkToken(token: string): Promise<any>;
  createToken(
      payload: IJwtServicePayload,
      secret: string,
      expiresIn: string,
  ): string;

  //CONFIG
  getJwtSecret(): string
  getJwtExpirationTime(): string
  getJwtRefreshSecret(): string
  getJwtRefreshExpirationTime(): string
}
