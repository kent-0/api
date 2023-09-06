/**
 * Enum describing the default device categories for access tokens.
 * This helps in identifying the nature and state of devices attempting to access resources.
 */
export enum DeviceTypes {
  /**
   * Indicates situations where the device information is retrievable but cannot be controlled or managed.
   * This might be due to limitations in the device or restrictions in the system's capability to manage it.
   */
  NotAvailable = '[Device not available]',

  /**
   * Represents scenarios where the system couldn't ascertain any device information.
   * This might occur when a device is not registered or not recognized by the system.
   */
  NotFound = '[Device not found]',
}
