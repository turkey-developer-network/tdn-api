import type { Notification } from "@core/domain/entities/notification.entity";

/**
 * Output interface for retrieving user notifications.
 *
 * This interface defines the structure of the data returned when fetching
 * notifications for a user.
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
}
