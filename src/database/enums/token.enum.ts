/**
 * Enumeration detailing the various token types associated with user accounts.
 * Each token type serves a specific purpose in the authentication and authorization process.
 */
export enum TokenType {
  /**
   * Represents an authentication token.
   * This token type grants users the necessary permissions to access their accounts or specific resources within the system.
   */
  AUTH = 'auth',

  /**
   * Represents a token specifically used for refreshing an expired or old authentication token.
   * It allows users to maintain their session or regain access without needing to re-enter their credentials.
   */
  REFRESH = 'refresh',
}
