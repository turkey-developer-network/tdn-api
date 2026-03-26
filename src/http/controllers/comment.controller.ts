/**
 * Controller for handling comment-related HTTP requests
 * Manages creation of comments and nested comments
 */
import type { CreateCommentUseCase } from "@core/use-cases/comment/create-comment/create-comment.usecase";
import type { DeleteCommentUseCase } from "@core/use-cases/comment/delete-comment/delete-comment.usecase";
import type {
    CreateCommentBody,
    CreateCommentParams,
} from "@typings/schemas/comment/create-comment.schema";
import type { DeleteCommentParams } from "@typings/schemas/comment/delete-comment.schema";
import type { FastifyRequest, FastifyReply } from "fastify";

export class CommentController {
    /**
     * Creates a new CommentController instance
     * @param createCommentUseCase - Use case for creating comments
     */
    constructor(
        private readonly createCommentUseCase: CreateCommentUseCase,
        private readonly deleteCommentUseCase: DeleteCommentUseCase,
    ) {}

    /**
     * Creates a new comment on a post
     * @param request - Fastify request containing comment data and post ID
     * @param reply - Fastify reply for sending response
     * @returns Promise that resolves when comment is created
     */
    async create(
        request: FastifyRequest<{
            Params: CreateCommentParams;
            Body: CreateCommentBody;
        }>,
        reply: FastifyReply,
    ): Promise<void> {
        const userId = request.user.id;
        const postId = request.params.id;
        const { content, parentId } = request.body;

        const comment = await this.createCommentUseCase.execute({
            content,
            postId,
            authorId: userId,
            parentId,
        });

        return reply.status(201).send({
            data: {
                id: comment.id,
            },
            meta: {
                timestamp: new Date().toISOString(),
            },
        });
    }

    async delete(
        request: FastifyRequest<{ Params: DeleteCommentParams }>,
        reply: FastifyReply,
    ): Promise<void> {
        const { id: postId, commentId } = request.params;
        const userId = request.user.id;

        await this.deleteCommentUseCase.execute({
            commentId,
            postId,
            userId,
        });

        return reply.status(204).send();
    }
}
