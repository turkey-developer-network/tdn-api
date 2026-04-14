import type { ICommentRepository } from "@core/ports/repositories/comment.repository";
import type { Comment } from "@core/domain/entities/comment.entity";
import { NotFoundError } from "@core/errors";
import type { GetCommentUseCaseInput } from "./get-comment-usecase.input";

export class GetCommentUseCase {
    /**
     * @param commentRepository - Repository for accessing comment data, used to retrieve the comment by its ID and to verify its existence before returning it
     */
    constructor(private readonly commentRepository: ICommentRepository) {}
    /**
     * Executes the use case to retrieve a comment based on the provided input
     * @param input - The input containing the comment ID and an optional current user ID for additional context
     * @throws NotFoundError if the comment does not exist
     * @returns The retrieved comment if found, including any relevant information based on the current user context
     */
    async execute(input: GetCommentUseCaseInput): Promise<Comment> {
        const comment = await this.commentRepository.findById(
            input.commentId,
            input.currentUserId,
        );

        if (!comment) {
            throw new NotFoundError("Comment not found.");
        }

        return comment;
    }
}
