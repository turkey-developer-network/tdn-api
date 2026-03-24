import type { LikePostUseCase } from "@core/use-cases/post/like-post";
import type { UnlikePostUseCase } from "@core/use-cases/post/unlike-post";
import type { LikePostParams } from "@typings/schemas/post/like-post.schema";
import type { FastifyReply, FastifyRequest } from "fastify";

/**
 * Controller for handling post like/unlike HTTP requests
 *
 * Manages the HTTP layer for post like operations including liking and unliking posts.
 * This controller acts as the interface between HTTP requests and the underlying use cases.
 */
export class LikeController {
    /**
     * Creates a new LikeController instance
     * @param likePostUseCase - Use case for liking posts
     * @param unlikePostUseCase - Use case for unliking posts
     */
    constructor(
        private readonly likePostUseCase: LikePostUseCase,
        private readonly unlikePostUseCase: UnlikePostUseCase,
    ) {}

    /**
     * Likes a post by ID
     * @param request - HTTP request containing the post ID to like
     * @param reply - HTTP response object
     */
    async likePost(
        request: FastifyRequest<{ Params: LikePostParams }>,
        reply: FastifyReply,
    ): Promise<void> {
        const userId = request.user.id;
        const postId = request.params.id;

        await this.likePostUseCase.execute({ postId, userId });

        return reply.status(204).send();
    }

    /**
     * Unlikes a post by ID
     * @param request - HTTP request containing the post ID to unlike
     * @param reply - HTTP response object
     */
    async unlikePost(
        request: FastifyRequest<{ Params: LikePostParams }>,
        reply: FastifyReply,
    ): Promise<void> {
        const userId = request.user.id;
        const postId = request.params.id;

        await this.unlikePostUseCase.execute({ postId, userId });

        return reply.status(204).send();
    }
}
