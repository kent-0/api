/**
 * Defines the shape of the payload data contained within a JSON Web Token (JWT).
 * JWTs are used in authentication to represent a set of claims that are issued by
 * the server and can be verified by the client. This interface is specifically tailored
 * to represent the JWTs used in the application for user authentication.
 */
export interface JWTPayload {
  /**
   * Represents the "Issued At" claim, which identifies the time at which the JWT was issued.
   * This can be useful for determining the age of the JWT.
   *
   * @type {number | undefined}
   * @description The timestamp (in seconds since Unix epoch) when the JWT was issued.
   * @optional
   */
  iat?: number;

  /**
   * Represents the entire raw JWT as a string. This can be useful in contexts where the
   * complete JWT string is needed, such as when sending it in an HTTP Authorization header.
   *
   * @type {string}
   * @description Raw JWT token string.
   * @required
   */
  raw: string;

  /**
   * Represents the "Subject" claim, which is used to identify the principal that is the
   * subject of the JWT. In the context of this application, it's used to represent the user's ID.
   * This ensures that the JWT is associated with a specific user.
   *
   * @type {string}
   * @description An identifier representing the user's ID.
   * @required
   */
  sub: string;
}
