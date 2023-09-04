import { Reflector } from '@nestjs/core';

export const RequestPermissions = Reflector.createDecorator<number[]>();
