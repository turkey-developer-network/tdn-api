/**
 * Profile search module exports.
 *
 * This module provides functionality for searching user profiles
 * by username or full name with pagination support.
 */

/**
 * Use case for searching user profiles.
 * Handles the process of searching user profiles by username or full name.
 */
export * from "./search-profile.usecase";

/**
 * Input interface for searching profiles.
 * Defines the required and optional parameters for searching user profiles.
 */
export * from "./search-profile-usecase.input";

/**
 * Output interface for profile search results.
 * Defines the structure of the data returned when searching for profiles.
 */
export * from "./search-profile-usecase.output";
