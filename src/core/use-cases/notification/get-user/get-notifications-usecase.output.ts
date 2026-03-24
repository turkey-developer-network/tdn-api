import type { Notification } from "@core/domain/entities/notification.entity";

/**
 * Output interface for retrieving user notifications with pagination.
 *
 * This interface defines the structure of the data returned when fetching
 * notifications for a user with pagination support.
 */
export interface GetNotificationsOutput {
    /**
     * Array of notification entities for the user.
     */
    notifications: Notification[];

    /**
     * Total number of notifications available for the user.
     */
    total: number;

    /**
     * Current page number (1-based).
     */
    currentPage: number;

    /**
     * Total number of pages available.
     */
    totalPages: number;
}
