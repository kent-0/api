import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * The `UserToken` is a custom parameter decorator for NestJS which allows for
 * easy extraction of user token information from the execution context within a request.
 *
 * It is particularly useful in GraphQL applications when you want to access the user's
 * token details from the context of your resolvers. With this decorator, you can easily
 * annotate a method parameter to inject the user's token information without writing
 * repetitive code.
 *
 * The decorator works by:
 * 1. Transforming the standard execution context into a GraphQL execution context.
 * 2. Extracting user token information from the request object within this context.
 * 3. Parsing the 'Authorization' header to get the raw token value.
 * 4. Returning an object with both the token details and the raw token value.
 *
 * @param _ Unused parameter. Reserved for potential future use.
 * @param {ExecutionContext} context The current execution context.
 *
 * @returns {object} An object containing user token information and the raw token value.
 */
export const UserToken = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    // Transform the standard execution context into a GraphQL execution context.
    const ctx = GqlExecutionContext.create(context).getContext();

    // Return the user token details and the raw token value.
    return {
      ...ctx.req.user,
      raw: ctx.req.headers.authorization?.split(' ')[1],
    };
  },
);
