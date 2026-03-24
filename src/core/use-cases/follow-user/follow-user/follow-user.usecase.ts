import { BadRequestError } from "@core/errors";
import type { IFollowRepository } from "@core/ports/repositories/follow.repository";
import type { INotificationRepository } from "@core/ports/repositories/notification.repository";
import { Notification } from "@core/domain/entities/notification.entity";
import { NotificationType } from "@core/domain/enums/notification-type.enum";
import type { RealtimePort } from "@core/ports/services/realtime.port";

/**
 * Use case for following another user.
 *
 * This use case handles the process of following a user, creating a notification
 * for the target user, and emitting a real-time event.
 */
export class FollowUserUseCase {
    /**
     * Creates a new instance of FollowUserUseCase.
     *
     * @param followUserRepository - Repository for managing follow relationships
     * @param notificationRepository - Repository for managing notifications
     * @param realtimeService - Service for real-time communication
     */
    constructor(
        private readonly followUserRepository: IFollowRepository,
        private readonly notificationRepository: INotificationRepository,
        private readonly realtimeService: RealtimePort,
    ) {}

    /**
     * Executes the follow user process.
     *
     * @param currentUserId - The ID of the user initiating the follow
     * @param targetId - The ID of the user to be followed
     * @returns Promise<void> - Resolves when follow operation is complete
     *
     * @throws BadRequestError - When user tries to follow themselves
     *
     * @remarks
     * If the user is already following the target, the method returns silently.
     * Otherwise, it creates the follow relationship, sends a notification,
     * and emits a real-time event to the target user.
     */
    async execute(currentUserId: string, targetId: string): Promise<void> {
        if (currentUserId === targetId)
            throw new BadRequestError("You cannot follow yourself.");

        const isFollowing = await this.followUserRepository.checkIsFollowing(
            currentUserId,
            targetId,
        );

        if (isFollowing) return;

        await this.followUserRepository.followUser(currentUserId, targetId);

        const notification = Notification.create(
            targetId,
            currentUserId,
            NotificationType.FOLLOW,
        );

        await this.notificationRepository.create(notification);

        this.realtimeService.emitToUser(targetId, "new-notification", {
            type: NotificationType.FOLLOW,
            issuerId: currentUserId,
        });
    }
}
