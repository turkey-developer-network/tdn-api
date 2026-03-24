/**
 * GitHub OAuth authentication module exports.
 *
 * This module provides the GitHub OAuth login functionality for the application,
 * including the use case implementation and input interface.
 */

/**
 * GitHub OAuth login use case implementation.
 * Handles the complete GitHub OAuth authentication process including
 * user creation, token generation, and refresh token management.
 */
export * from "./github-login.usecase";

/**
 * Input interface for GitHub OAuth login.
 * Defines the required parameters for authenticating a user through GitHub OAuth flow.
 */
export * from "./github-login.input";
