/**
 * Props interface for Notification entity
 */
export interface NotificationProps {
    recipientId: string;
    username: string;
    type: string; // NotificationType enum value
    avatarUrl: string;
    createdAt: Date;
    isRead: boolean;
}

/**
 * Rich domain model for Notification entity
 * Encapsulates both data and business logic related to notifications
 */
export class Notification {
    constructor(private readonly props: NotificationProps) {}

    /**
     * Get the ID of the user who received this notification
     */
    get recipientId(): string {
        return this.props.recipientId;
    }

    /**
     * Get the username of the notification issuer
     */
    get username(): string {
        return this.props.username;
    }

    /**
     * Get the type of the notification
     */
    get type(): string {
        return this.props.type;
    }

    /**
     * Get the avatar URL of the notification issuer
     */
    get avatarUrl(): string {
        return this.props.avatarUrl;
    }

    /**
     * Get the creation date of the notification
     */
    get createdAt(): Date {
        return this.props.createdAt;
    }

    /**
     * Check if the notification has been read
     */
    get isRead(): boolean {
        return this.props.isRead;
    }

    /**
     * Check if the notification is unread
     */
    public isUnread(): boolean {
        return !this.props.isRead;
    }

    /**
     * Mark the notification as read
     */
    public markAsRead(): void {
        this.props.isRead = true;
    }

    /**
     * Check if this notification is of a specific type
     */
    public isType(notificationType: string): boolean {
        return this.props.type === notificationType;
    }

    /**
     * Check if this is a follow notification
     */
    public isFollowNotification(): boolean {
        return this.isType("FOLLOW");
    }

    /**
     * Check if this is a new post notification
     */
    public isNewPostNotification(): boolean {
        return this.isType("NEW_POST");
    }

    /**
     * Get a human-readable description of the notification
     */
    public getDescription(): string {
        switch (this.props.type) {
            case "FOLLOW":
                return `${this.props.username} started following you`;
            case "NEW_POST":
                return `${this.props.username} posted a new update`;
            default:
                return `Notification from ${this.props.username}`;
        }
    }

    /**
     * Check if the notification was created within the last specified hours
     */
    public isRecent(hours: number): boolean {
        const now = new Date();
        const timeDiff = now.getTime() - this.props.createdAt.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        return hoursDiff <= hours;
    }
}
