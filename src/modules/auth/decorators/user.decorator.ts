import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Custom decorator to retrieve user token information from the context.
 * @param _: Unused parameter.
 * @param context The execution context.
 * @returns An object containing user token information and the raw token value.
 */
export const UserToken = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context).getContext();
    return {
      ...ctx.req.user,
      raw: ctx.req.headers.authorization?.split(' ')[1],
    };
  },
);
