import type { NotificationType } from "@generated/prisma/client";
import type { NotificationType as CoreNotificationType } from "@core/domain/enums/notification-type.enum";
import type { Notification } from "@core/domain/entities/notification.entity";

export interface PrismaNotificationItem {
    id: string;
    createdAt: Date;
    type: NotificationType;
    recipientId: string;
    issuerId: string;
    referenceId: string | null;
    isRead: boolean;
    issuer: {
        username: string;
        profile: {
            avatarUrl: string;
        } | null;
    };
}

export class NotificationPrismaMapper {
    public static toResponse(item: PrismaNotificationItem): {
        avatarUrl: string;
        createdAt: Date;
        type: CoreNotificationType;
        recipientId: string;
        username: string;
        isRead: boolean;
    } {
        return {
            avatarUrl: item.issuer.profile!.avatarUrl,
            createdAt: item.createdAt,
            type: item.type as unknown as CoreNotificationType,
            recipientId: item.recipientId,
            username: item.issuer.username,
            isRead: item.isRead,
        };
    }

    public static toGetNotificationOutput(notification: Notification): {
        avatarUrl: string;
        createdAt: Date;
        type: CoreNotificationType;
        recipientId: string;
        username: string;
        isRead: boolean;
    } {
        return {
            avatarUrl: notification.avatarUrl,
            createdAt: notification.createdAt,
            type: notification.type as CoreNotificationType,
            recipientId: notification.recipientId,
            username: notification.username,
            isRead: notification.isRead,
        };
    }
}
