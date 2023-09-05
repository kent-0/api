import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

/**
 * The `JwtAuthGuard` is a custom guard in NestJS tailored specifically for GraphQL endpoints.
 * It extends the built-in `AuthGuard` provided by `@nestjs/passport` and is configured to
 * work with JWT (JSON Web Tokens) based authentication.
 *
 * The primary purpose of this guard is to extract the HTTP request object from the GraphQL
 * execution context, which is different from a standard RESTful API context. This extraction
 * is necessary because the `AuthGuard` expects to work with the request object directly.
 *
 * When this guard is applied to a GraphQL resolver or any other NestJS method, it will ensure
 * that the incoming request is authenticated using a JWT before allowing access to the endpoint.
 *
 * @extends {AuthGuard}
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Overrides the base `getRequest` method to cater to the GraphQL execution context.
   *
   * In a GraphQL server, the request object is nested deeper than in a RESTful context.
   * This method dives into the GraphQL execution context and extracts the HTTP request object.
   *
   * Once the request object is retrieved, the `AuthGuard` can then use it to validate
   * the JWT and authenticate the request.
   *
   * @param {ExecutionContext} context The current execution context.
   *
   * @returns {Request} The HTTP request object.
   */
  getRequest(context: ExecutionContext) {
    // Transform the standard execution context into a GraphQL execution context.
    const ctx = GqlExecutionContext.create(context);
    // Extract and return the HTTP request object.
    return ctx.getContext().req;
  }
}
