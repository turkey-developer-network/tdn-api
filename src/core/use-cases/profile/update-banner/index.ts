/**
 * Profile banner update module exports.
 *
 * This module provides functionality for updating user profile banners
 * including image upload, profile update, and old image cleanup.
 */

/**
 * Use case for updating a user's profile banner.
 * Handles uploading a new banner image, updating the profile with the new image URL,
 * and cleaning up the old banner if it exists.
 */
export * from "./update-banner.usecase";

/**
 * Input interface for updating profile banner.
 * Defines the required parameters for uploading and updating a user's profile banner image.
 */
export * from "./update-banner-usecase.input";
