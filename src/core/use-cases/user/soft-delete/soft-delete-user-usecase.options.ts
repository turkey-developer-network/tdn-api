/**
 * Options interface for soft deleting a user account.
 *
 * This interface defines the optional parameters for configuring
 * the soft delete operation, particularly the grace period.
 */
export interface SoftDeleteUserUseCaseOptions {
    /**
     * The number of days to wait before permanently deleting the user account.
     * During this period, the user account is marked as deleted but not
     * actually removed from the database.
     */
    day: number;
}
