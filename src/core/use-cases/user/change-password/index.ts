/**
 * Password change module exports.
 *
 * This module provides functionality for changing a user's password
 * with validation and security measures.
 */

/**
 * Use case for changing a user's password.
 * Handles validating the current password and updating it with a new password,
 * including validation to ensure the new password is different.
 */
export * from "./change-password-use.case";

/**
 * Input interface for changing password.
 * Defines the required parameters for changing a user's password with validation.
 */
export * from "./change-password-usecase.input";
