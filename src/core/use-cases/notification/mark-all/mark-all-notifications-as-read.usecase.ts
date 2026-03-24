import type { INotificationRepository } from "@core/ports/repositories/notification.repository";

/**
 * Use case for marking all notifications as read for a user.
 *
 * This use case handles the process of updating all unread notifications
 * for a specific user to read status.
 */
export class MarkAllNotificationsAsReadUseCase {
    /**
     * Creates a new instance of MarkAllNotificationsAsReadUseCase.
     *
     * @param notificationRepository - Repository for managing notifications
     */
    constructor(
        private readonly notificationRepository: INotificationRepository,
    ) {}

    /**
     * Executes the mark all notifications as read process.
     *
     * @param userId - The ID of the user whose notifications to mark as read
     * @returns Promise<void> - Resolves when all notifications are marked as read
     *
     * @remarks
     * This method updates all notifications for the specified user to read status
     * in a single database operation for optimal performance.
     */
    async execute(userId: string): Promise<void> {
        await this.notificationRepository.markAllAsRead(userId);
    }
}
