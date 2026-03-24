/**
 * Password reset module exports.
 *
 * This module provides the password reset functionality for the application,
 * including the use case implementation and input interface.
 */

/**
 * Password reset use case implementation.
 * Handles the process of initiating a password reset for a user by generating
 * a verification token and sending a reset email.
 */
export * from "./forgot-password.usecase";

/**
 * Input interface for password reset requests.
 * Defines the required parameters for initiating a password reset process.
 */
export * from "./forgot-password.input";
