import type { NotificationType } from "../enums";

/**
 * Props interface for Notification entity
 *
 * Represents the properties required to create or update a notification.
 * Notifications are used to inform users about various activities and events
 * within the application such as follows, likes, comments, etc.
 */
export interface NotificationProps {
    /** The unique identifier of the user who will receive this notification */
    recipientId: string;

    /** The unique identifier of the user who triggered this notification */
    issuerId: string;

    /** The type of notification (follow, like, comment, etc.) */
    type: NotificationType;

    /** Optional reference ID for the related entity (post ID, comment ID, etc.) */
    referenceId?: string;

    /** Optional username of the issuer for display purposes */
    username?: string;

    /** Optional avatar URL of the issuer for display purposes */
    avatarUrl?: string;

    /** Optional creation timestamp, defaults to current time if not provided */
    createdAt?: Date;

    /** Boolean flag indicating whether the notification has been read by the recipient */
    isRead: boolean;
}
