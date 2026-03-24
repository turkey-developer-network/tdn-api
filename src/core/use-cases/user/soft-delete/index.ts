/**
 * User soft delete module exports.
 *
 * This module provides functionality for soft deleting user accounts
 * with password validation and grace period configuration.
 */

/**
 * Use case for soft deleting a user account.
 * Handles the process of soft deleting a user account with password validation
 * and setting a deletion grace period.
 */
export * from "./soft-delete-user.usecase";

/**
 * Input interface for soft deleting a user account.
 * Defines the required parameters for the soft delete operation including
 * user identification and password validation for security.
 */
export * from "./soft-delete-user-usecase.input";

/**
 * Options interface for soft deleting a user account.
 * Defines the optional parameters for configuring the soft delete operation,
 * particularly the grace period.
 */
export * from "./soft-delete-user-usecase.options";
