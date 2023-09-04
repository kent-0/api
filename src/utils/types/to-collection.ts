import { Collection } from '@mikro-orm/core';

export type ToCollection<T> = {
  [K in keyof T]: T[K] extends Array<unknown> ? Collection<any, any> : T[K];
};
