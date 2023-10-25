import { getNestedPropertyValue } from '~/utils/functions/search-object';

import { describe, expect, it } from 'vitest';

describe('Search object', () => {
  it('should get a property in first level object property', () => {
    const obj = { foo: 'bar' };
    expect(getNestedPropertyValue(obj, 'foo')).toBe('bar');
  });

  it('should get a property in second level object property', () => {
    const obj = { foo: { bar: 'baz' } };
    expect(getNestedPropertyValue(obj, 'foo.bar')).toBe('baz');
  });

  it('should get a property in third level object property', () => {
    const obj = { foo: { bar: { baz: 'qux' } } };
    expect(getNestedPropertyValue(obj, 'foo.bar.baz')).toBe('qux');
  });

  it('should has error because property not found', () => {
    const obj = { foo: { bar: { baz: 'qux' } } };
    expect(getNestedPropertyValue(obj, 'foo.bar.qux')).toBeUndefined();
  });
});
