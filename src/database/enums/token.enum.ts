/**
 * Types of tokens available for user accounts.
 */
export enum TokenType {
  /**
   * Authorization to access the account.
   */
  AUTH = 'auth',

  /**
   * Refresh token for the authentication type token.
   */
  REFRESH = 'refresh',
}
