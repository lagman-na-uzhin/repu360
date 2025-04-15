export interface IJwtServicePayload {
  authId: string;
  ownerId?: string;
  user: 'MANAGER' | 'EMPLOYEE'
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
