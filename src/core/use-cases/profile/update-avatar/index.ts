/**
 * Profile avatar update module exports.
 *
 * This module provides functionality for updating user profile avatars
 * including image upload, profile update, and old image cleanup.
 */

/**
 * Use case for updating a user's profile avatar.
 * Handles uploading a new avatar image, updating the profile with the new image URL,
 * and cleaning up the old avatar if it exists.
 */
export * from "./update-avatar.usecase";

/**
 * Input interface for updating profile avatar.
 * Defines the required parameters for uploading and updating a user's profile picture.
 */
export * from "./update-avatar-usecase.input";
