import { Injectable } from '@nestjs/common';

/**
 * Bit-based permission manager
 * It allows adding, removing, verifying and obtaining the permissions of the role and/or user.
 */
@Injectable()
export class PermissionManagerService {
  private _perms = 0;

  /**
   * Add permissions to the base permissions passed in the admin constructor.
   * @param permission Permission bit to add.
   */
  public add(permission: number) {
    // Add the specified permission bit to the managed permissions.
    this._perms |= permission;

    return this;
  }

  /**
   * Add multiple permissions to the base permissions passed in the admin constructor.
   * @param permissions Array of permission bits to add.
   */
  public bulkAdd(permissions: number[]) {
    // Loop through the array of permissions and add each one.
    for (const p of permissions) {
      this.add(p);
    }

    return this;
  }

  /**
   * Remove permissions from the base permissions passed in the admin constructor.
   * @param permissions Array of permission bits to remove.
   */
  public bulkRemove(permissions: number[]) {
    // Loop through the array of permissions and remove each one.
    for (const p of permissions) {
      this.remove(p);
    }

    return this;
  }

  /**
   * Check if the permission is valid for the permission bit passed in the manager construct.
   * @param permission Permission bit to verify.
   */
  public has(permission: number) {
    // Check if the specified permission bit is present in the managed permissions.
    return (this._perms & permission) === permission;
  }

  /**
   * Gets the new, managed permissions bit.
   */
  public get permissions() {
    // Get the current managed permissions.
    return this._perms;
  }

  /**
   * Remove permissions from the base permissions passed in the admin constructor.
   * @param permission Permission bit to remove.
   */
  public remove(permission: number) {
    // Remove the specified permission bit from the managed permissions.
    this._perms &= ~permission;

    return this;
  }
}
