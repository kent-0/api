import { Test } from '@nestjs/testing';

import { ProjectPermissionsEnum } from '~/permissions/enums/project.enum';
import { PermissionManagerService } from '~/permissions/services/manager.service';

import { beforeEach, describe, expect, it } from 'vitest';

/**
 * Test suite for the Permission Manager.
 * This suite tests all the functionalities provided by the `PermissionManagerService`.
 */
describe('Permission Manager', () => {
  let manager: PermissionManagerService; // Instance of PermissionManagerService to be tested.

  /**
   * Before each test case, initialize the `PermissionManagerService`.
   */
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PermissionManagerService], // Provide the service to be tested.
    }).compile();

    manager = module.get<PermissionManagerService>(PermissionManagerService); // Get an instance of the service.
  });

  /**
   * Test Case: Adding a Permission
   * This test case ensures that a permission can be added to the root permissions.
   */
  it('should add a permission to root permissions', () => {
    manager.add(ProjectPermissionsEnum.ProjectUpdate); // Add a permission.
    expect(manager.has(ProjectPermissionsEnum.ProjectUpdate)).toBe(true); // Check if the permission is added.
  });

  /**
   * Test Case: Removing a Permission
   * This test case ensures that a permission can be removed from the root permissions.
   */
  it('should remove a permission from root permissions', () => {
    manager.add(ProjectPermissionsEnum.ProjectUpdate); // Add a permission.
    expect(manager.has(ProjectPermissionsEnum.ProjectUpdate)).toBe(true); // Ensure the permission is added.

    manager.remove(ProjectPermissionsEnum.ProjectUpdate); // Remove the permission.
    expect(manager.has(ProjectPermissionsEnum.ProjectUpdate)).toBe(false); // Check if the permission is removed.
  });

  /**
   * Test Case: Adding Multiple Permissions
   * This test case ensures that multiple permissions can be added at once to the root permissions.
   */
  it('should add bulk permissions to root permissions', () => {
    manager.bulkAdd([
      // Add multiple permissions.
      ProjectPermissionsEnum.ProjectUpdate,
      ProjectPermissionsEnum.RoleCreate,
    ]);

    expect(manager.has(ProjectPermissionsEnum.ProjectUpdate)).toBe(true); // Ensure the first permission is added.
    expect(manager.has(ProjectPermissionsEnum.RoleCreate)).toBe(true); // Ensure the second permission is added.
  });

  /**
   * Test Case: Removing Multiple Permissions
   * This test case ensures that multiple permissions can be removed at once from the root permissions.
   */
  it('should remove bulk permissions from root permissions', () => {
    manager.bulkAdd([
      // Add multiple permissions.
      ProjectPermissionsEnum.ProjectUpdate,
      ProjectPermissionsEnum.RoleCreate,
    ]);

    expect(manager.has(ProjectPermissionsEnum.ProjectUpdate)).toBe(true); // Ensure the first permission is added.
    expect(manager.has(ProjectPermissionsEnum.RoleCreate)).toBe(true); // Ensure the second permission is added.

    manager.bulkRemove([
      // Remove multiple permissions.
      ProjectPermissionsEnum.ProjectUpdate,
      ProjectPermissionsEnum.RoleCreate,
    ]);

    expect(manager.has(ProjectPermissionsEnum.ProjectUpdate)).toBe(false); // Check if the first permission is removed.
    expect(manager.has(ProjectPermissionsEnum.RoleCreate)).toBe(false); // Check if the second permission is removed.
    expect(manager.permissions).toBe(0); // Check if the root permissions are empty.
  });
});
