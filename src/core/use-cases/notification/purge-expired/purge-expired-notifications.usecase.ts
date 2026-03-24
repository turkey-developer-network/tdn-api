import type { INotificationRepository } from "@core/ports/repositories/notification.repository";

/**
 * Use case for purging expired notifications from the system.
 *
 * This use case is responsible for cleaning up expired notifications from the database
 * based on a specified grace period. It's typically used as part of a scheduled cleanup
 * process to maintain system performance and storage efficiency.
 */
export class PurgeExpiredNotificationsUseCase {
    /**
     * Creates a new instance of PurgeExpiredNotificationsUseCase.
     *
     * @param notificationRepository - Repository for managing notification data
     */
    constructor(
        private readonly notificationRepository: INotificationRepository,
    ) {}

    /**
     * Executes the purge operation to remove expired notifications.
     *
     * @param gracePeriodDays - Number of days to keep notifications before deletion
     * @returns Promise<number> The number of expired notifications that were deleted
     *
     * @remarks
     * This method calculates a cutoff date by subtracting the grace period from
     * the current date, then deletes all notifications older than this cutoff.
     */
    async execute(gracePeriodDays: number): Promise<number> {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - gracePeriodDays);

        return this.notificationRepository.deleteExpiredNotifications(
            cutoffDate,
        );
    }
}
