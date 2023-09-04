import { Collection } from '@mikro-orm/core';

export type ToCollections<T> = {
  [K in keyof T]: T[K] extends Array<unknown>
    ? Collection<any, any>
    : T[K] extends object
    ? ToCollections<T[K]>
    : T[K];
};
