/**
 * Google OAuth authentication module exports.
 *
 * This module provides the Google OAuth login functionality for the application,
 * including the use case implementation and input interface.
 */

/**
 * Google OAuth login use case implementation.
 * Handles the complete Google OAuth authentication process including
 * user creation, token generation, and refresh token management.
 */
export * from "./google.login.usecase";

/**
 * Input interface for Google OAuth login.
 * Defines the required parameters for authenticating a user through Google OAuth flow.
 */
export * from "./google-login.input";
