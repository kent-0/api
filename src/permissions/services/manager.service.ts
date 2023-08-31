import { Injectable } from '@nestjs/common';

/**
 * Bit-based permission manager
 * It allows adding, removing, verifying and obtaining the permissions of the role and/or user.
 */
@Injectable()
export class PermissionManagerService {
  constructor(private _perms = 0) {}

  /**
   * Add permissions to the base permissions passed in the admin constructor.
   * @param permission Permission bit to add.
   */
  public add(permission: number) {
    this._perms |= permission;
  }

  /**
   * Check if the permission is valid for the permission bit passed in the manager construct.
   * @param permission Permission bit to verify.
   */
  public has(permission: number) {
    this._perms & permission;
  }

  /**
   * Gets the new, managed permissions bit.\
   */
  public get permissions() {
    return this._perms;
  }

  /**
   * Remove permissions to the base permissions passed in the admin constructor.
   * @param permission Permission bit to remove.
   */
  public remove(permission: number) {
    this._perms &= permission;
  }
}
