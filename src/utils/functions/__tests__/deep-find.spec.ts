import { deepFindKey } from '~/utils/functions/deep-find';

import { describe, expect, it } from 'vitest';

describe('Deep find in object', () => {
  it('should get a property with name "foo" in first level object property', () => {
    const obj = { foo: 'bar' };
    expect(deepFindKey(obj, 'foo')).toBe('bar');
  });

  it('should get a property with name "bar" in second level object property', () => {
    const obj = { foo: { bar: 'baz' } };
    expect(deepFindKey(obj, 'bar')).toBe('baz');
  });

  it('should get a property with name "baz" in third level object property', () => {
    const obj = { foo: { bar: { baz: 'qux' } } };
    expect(deepFindKey(obj, 'baz')).toBe('qux');
  });

  it('should has error because property not found', () => {
    const obj = { foo: { bar: { baz: 'qux' } } };
    expect(deepFindKey(obj, 'qux')).toBeUndefined();
  });
});
