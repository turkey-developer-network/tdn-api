import type { IPostRepository } from "@core/ports/repositories/post.repository";
import type { IPostLikeRepository } from "@core/ports/repositories/post-like.repository";
import type { INotificationRepository } from "@core/ports/repositories/notification.repository";
import type { RealtimePort } from "@core/ports/services/realtime.port";
import { Notification } from "@core/domain/entities/notification.entity";
import { NotificationType } from "@core/domain/enums/notification-type.enum";
import { NotFoundError } from "@core/errors";
import type { LikePostUseCaseInput } from "./like-post-usecase.input";

/**
 * Use case for liking a post
 *
 * Handles the business logic for creating a like relationship between a user and a post.
 * Also manages notification creation and real-time updates when a post is liked by someone
 * other than the post author.
 */
export class LikePostUseCase {
    /**
     * Creates a new LikePostUseCase instance
     * @param postRepository - Repository for post data operations
     * @param postLikeRepository - Repository for post like relationships
     * @param notificationRepository - Repository for notification data operations
     * @param realtimeService - Service for real-time communication
     */
    constructor(
        private readonly postRepository: IPostRepository,
        private readonly postLikeRepository: IPostLikeRepository,
        private readonly notificationRepository: INotificationRepository,
        private readonly realtimeService: RealtimePort,
    ) {}

    /**
     * Executes the like post use case
     * @param input - Input containing post ID and user ID
     * @returns Promise<void>
     */
    async execute(input: LikePostUseCaseInput): Promise<void> {
        const post = await this.postRepository.findById(input.postId);

        if (!post) throw new NotFoundError("Post not found.");

        const alreadyLiked = await this.postLikeRepository.isLiked(
            input.postId,
            input.userId,
        );

        if (alreadyLiked) return;

        await this.postLikeRepository.like(input.postId, input.userId);

        if (post.author.id !== input.userId) {
            const notification = Notification.create(
                post.author.id,
                input.userId,
                NotificationType.LIKE,
            );

            await this.notificationRepository.create(notification);

            this.realtimeService.emitToUser(
                post.author.id,
                "new-notification",
                {
                    type: NotificationType.LIKE,
                    issuerId: input.userId,
                },
            );
        }
    }
}
