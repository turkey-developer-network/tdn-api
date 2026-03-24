/**
 * Input interface for retrieving user notifications with pagination.
 *
 * This interface defines the required parameters for fetching notifications
 * for a specific user with pagination support.
 */
export interface GetNotificationsInput {
    /**
     * The unique identifier of the user whose notifications are being retrieved.
     */
    userId: string;

    /**
     * The page number for pagination (1-based).
     * Must be a positive integer.
     */
    page: number;

    /**
     * The number of notifications to retrieve per page.
     * Must be a positive integer.
     */
    limit: number;
}
