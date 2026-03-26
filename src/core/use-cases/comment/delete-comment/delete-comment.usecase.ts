import type { ICommentRepository } from "@core/ports/repositories/comment.repository";
import type { CachePort } from "@core/ports/services/cache.port";
import { NotFoundError, ForbiddenError } from "@core/errors";
import type { DeleteCommentInput } from "./delete-comment-usecase.input";

export class DeleteCommentUseCase {
    constructor(
        private readonly commentRepository: ICommentRepository,
        private readonly redisService: CachePort,
    ) {}

    async execute(input: DeleteCommentInput): Promise<void> {
        const comment = await this.commentRepository.findById(input.commentId);

        if (!comment) {
            throw new NotFoundError("Comment not found.");
        }

        if (comment.authorId !== input.userId) {
            throw new ForbiddenError("This post is not yours.");
        }

        if (comment.postId !== input.postId) {
            throw new ForbiddenError(
                "This comment does not belong to the mentioned post.",
            );
        }

        await this.commentRepository.delete(input.commentId, input.postId);

        await this.redisService.deleteByPattern("posts:feed:*");
    }
}
