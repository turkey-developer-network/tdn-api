import type { GetNotificationOutput } from "@core/ports/repositories/notification.repository";
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
    public static toResponse(
        item: PrismaNotificationItem,
    ): GetNotificationOutput {
        return {
            avatarUrl: item.issuer.profile!.avatarUrl,
            createdAt: item.createdAt,
            type: item.type as unknown as CoreNotificationType,
            recipientId: item.recipientId,
            username: item.issuer.username,
            isRead: item.isRead,
        };
    }

    public static toGetNotificationOutput(
        notification: Notification,
    ): GetNotificationOutput {
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
