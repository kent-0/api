import { Join } from '../types/union';

export const createFieldPaths = <Base extends string, Fields extends string[]>(
  base: Base,
  ...fields: Fields
): Join<Base, (typeof fields)[number]>[] =>
  fields.map((field) => `${base}.${field}` as Join<Base, typeof field>);
