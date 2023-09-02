import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const UserToken = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context).getContext();
    return {
      ...ctx.req.user,
      raw: ctx.req.headers.authorization?.split(' ')[1],
    };
  },
);
