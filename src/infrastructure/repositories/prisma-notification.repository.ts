import type {
    INotificationRepository,
    FindNotificationsInput,
} from "@core/ports/repositories/notification.repository";
import type { PrismaTransactionalClient } from "@infrastructure/database/prisma-client.type";
import { Notification } from "@core/domain/entities/notification.entity";
import { NotificationType } from "@generated/prisma/client";

export class PrismaNotificationRepository implements INotificationRepository {
    private readonly typeMap: Record<string, NotificationType> = {
        [NotificationType.FOLLOW]: NotificationType.FOLLOW,
        [NotificationType.NEW_POST]: NotificationType.NEW_POST,
    };

    constructor(private readonly prisma: PrismaTransactionalClient) {}

    async create(notification: Notification): Promise<void> {
        const notificationLimit = 100;

        const prismaType = this.typeMap[notification.type];

        await this.prisma.notification.create({
            data: {
                recipientId: notification.recipientId,
                issuerId: notification.issuerId,
                type: prismaType,
                referenceId: notification.referenceId,
            },
        });

        const cutoffNotification = await this.prisma.notification.findMany({
            where: { recipientId: notification.recipientId },
            orderBy: { createdAt: "desc" },
            skip: notificationLimit,
            take: 1,
            select: { createdAt: true },
        });

        if (cutoffNotification.length > 0) {
            await this.prisma.notification.deleteMany({
                where: {
                    recipientId: notification.recipientId,
                    createdAt: { lte: cutoffNotification[0].createdAt },
                },
            });
        }
    }

    getUnreadCount(userId: string): Promise<number> {
        return this.prisma.notification.count({
            where: {
                recipientId: userId,
                isRead: false,
            },
        });
    }

    async findAllByUserId({
        userId,
        take,
        skip,
    }: FindNotificationsInput): Promise<Notification[]> {
        const raws = await this.prisma.notification.findMany({
            where: { recipientId: userId },
            take,
            skip,
            orderBy: { createdAt: "desc" },
            include: {
                issuer: {
                    select: {
                        username: true,
                        profile: {
                            select: {
                                avatarUrl: true,
                            },
                        },
                    },
                },
            },
        });

        return raws.map((raw) => {
            return new Notification({
                recipientId: raw.recipientId,
                issuerId: raw.issuerId,
                type: raw.type,
                referenceId: raw.referenceId || undefined,
                username: raw.issuer.username,
                avatarUrl: raw.issuer.profile?.avatarUrl || "",
                createdAt: raw.createdAt,
                isRead: raw.isRead,
            });
        });
    }

    async countByUserId(userId: string): Promise<number> {
        return this.prisma.notification.count({
            where: {
                recipientId: userId,
            },
        });
    }

    async markAllAsRead(userId: string): Promise<void> {
        await this.prisma.notification.updateMany({
            where: {
                recipientId: userId,
                isRead: false,
            },
            data: {
                isRead: true,
            },
        });
    }

    async deleteExpiredNotifications(cutoffDate: Date): Promise<number> {
        const result = await this.prisma.notification.deleteMany({
            where: {
                createdAt: { lt: cutoffDate },
            },
        });
        return result.count;
    }
}
