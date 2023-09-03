/**
 * Interface representing the payload of a JWT token.
 */
export interface JWTPayload {
  /**
   * Issued At timestamp in seconds.
   */
  iat?: number;

  /**
   * Raw JWT token string.
   */
  raw: string;

  /**
   * Subject identifier representing the user's ID.
   */
  sub: string;
}
