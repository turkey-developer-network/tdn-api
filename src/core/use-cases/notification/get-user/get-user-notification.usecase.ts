import type { INotificationRepository } from "@core/ports/repositories/notification.repository";
import type { GetNotificationsInput } from "./get-notifications-usecase.input";
import type { GetNotificationsOutput } from "./get-notifications-usecase.output";

/**
 * Use case for retrieving user notifications.
 *
 * This use case handles fetching notifications for a specific user with
 * pagination support.
 */
export class GetUserNotificatonUseCase {
    /**
     * Creates a new instance of GetUserNotificatonUseCase.
     *
     * @param notificationRepository - Repository for managing notifications
     */
    public constructor(
        private readonly notificationRepository: INotificationRepository,
    ) {}

    /**
     * Executes the get user notifications process.
     *
     * @param input - Input containing user ID, page, and limit for pagination
     * @returns Promise<GetNotificationsOutput> Notifications with pagination info
     *
     * @remarks
     * This method fetches notifications for the specified user with pagination.
     * It returns the notifications along with total count and pagination metadata.
     */
    async execute(
        input: GetNotificationsInput,
    ): Promise<GetNotificationsOutput> {
        const { userId, page, limit } = input;

        const skip = (page - 1) * limit;
        const take = limit;

        const [notifications, total] = await Promise.all([
            this.notificationRepository.findAllByUserId({
                userId,
                take,
                skip,
            }),
            this.notificationRepository.countByUserId(userId),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            notifications,
            total,
            currentPage: page,
            totalPages,
        };
    }
}
