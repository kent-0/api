export interface JWTPayload {
  exp?: number;
  iat?: number;
  sub: string;
}
