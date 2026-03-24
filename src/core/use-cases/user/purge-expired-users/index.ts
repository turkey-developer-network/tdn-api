/**
 * Expired user purge module exports.
 *
 * This module provides functionality for cleaning up expired user accounts
 * from the system as part of scheduled maintenance operations.
 */

/**
 * Use case for purging expired users.
 * Responsible for cleaning up expired user accounts from the database to maintain
 * system performance and remove accounts that have been pending deletion for too long.
 */
export * from "./purge-expired-users.use-case";
