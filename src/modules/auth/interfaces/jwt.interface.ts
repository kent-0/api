export interface JWTPayload {
  iat?: number;
  raw: string;
  sub: string;
}
