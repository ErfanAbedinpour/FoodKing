export interface IAccessTokenPayload {
  name: string;

  role: string;

  userId: number;
}

export interface IRefreshTokenPayload extends IAccessTokenPayload {
  tokenId: string;
}
