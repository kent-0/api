import { Reflector } from '@nestjs/core';

// eslint-disable-next-line @typescript-eslint/ban-types
export const ExcludeGuards = Reflector.createDecorator<Function[]>();
