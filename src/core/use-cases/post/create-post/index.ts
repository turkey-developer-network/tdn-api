/**
 * Post creation module exports.
 *
 * This module provides functionality for creating new posts with
 * optional media attachments and cache management.
 */

/**
 * Use case for creating a new post.
 * Handles the process of creating a post with optional media and
 * invalidating related cache entries.
 */
export * from "./create-post.usecase";

/**
 * Input interface for creating a post.
 * Defines the required parameters for creating a post with optional media.
 */
export * from "./create-post-usecase.input";
