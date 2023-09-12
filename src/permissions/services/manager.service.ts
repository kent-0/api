import { Injectable } from '@nestjs/common';

/**
 * Bit-based permission manager.
 * It allows adding, removing, verifying, and obtaining the permissions of the role and/or user.
 */
@Injectable()
export class PermissionManagerService {
  // Internal state to manage the permissions.
  private _perms = 0;

  /**
   * Add a permission to the current set of managed permissions.
   * @param permission - The permission bit to add.
   * @returns This service instance, allowing for method chaining.
   */
  public add(permission: number) {
    this._perms |= permission;
    return this;
  }

  /**
   * Add multiple permissions to the current set of managed permissions.
   * @param permissions - An array of permission bits to add.
   * @returns This service instance, allowing for method chaining.
   */
  public bulkAdd(permissions: number[]) {
    for (const p of permissions) {
      this.add(p);
    }
    return this;
  }

  /**
   * Remove multiple permissions from the current set of managed permissions.
   * @param permissions - An array of permission bits to remove.
   * @returns This service instance, allowing for method chaining.
   */
  public bulkRemove(permissions: number[]) {
    for (const p of permissions) {
      this.remove(p);
    }
    return this;
  }

  /**
   * Check if a given permission is present in the current set of managed permissions.
   * @param permission - The permission bit to check.
   * @returns True if the permission is present, false otherwise.
   */
  public has(permission: number): boolean {
    return (this._perms & permission) === permission;
  }

  /**
   * Remove a permission from the current set of managed permissions.
   * @param permission - The permission bit to remove.
   * @returns This service instance, allowing for method chaining.
   */
  public remove(permission: number) {
    this._perms &= ~permission;
    return this;
  }

  /**
   * Getter to retrieve the current set of managed permissions.
   * @returns The current set of managed permissions as a bit value.
   */
  public get permissions(): number {
    return this._perms;
  }
}
