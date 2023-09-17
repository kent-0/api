export const tuple = <T extends string[]>(...args: T): (typeof args)[number] =>
  args[0];
