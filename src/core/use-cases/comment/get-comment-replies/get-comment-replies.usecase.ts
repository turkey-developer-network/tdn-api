import type { ICommentRepository } from "@core/ports/repositories/comment.repository";
import type { Comment } from "@core/domain/entities/comment.entity";
import { NotFoundError } from "@core/errors";
import type { GetCommentRepliesUseCaseInput } from "./get-comment-replies.input";

/**
 * Use case for retrieving the replies of a specific comment. This use case checks if the parent comment exists before attempting to retrieve its replies, ensuring that an appropriate error is thrown if the parent comment is not found. If the parent comment exists, it retrieves the replies based on the provided pagination parameters and optional current user context.
 */
export class GetCommentRepliesUseCase {
    /**
     * @param commentRepository - Repository for accessing comment data, used to verify the existence of the parent comment and to retrieve its replies based on the provided input parameters
     */
    constructor(private readonly commentRepository: ICommentRepository) {}

    /**
     * Executes the use case to retrieve the replies of a comment based on the provided input
     * @param input - The input containing the comment ID, pagination parameters, and an optional current user ID for additional context
     * @throws NotFoundError if the parent comment does not exist
     * @returns An array of comments representing the replies to the specified parent comment, including any relevant information based on the current user context
     */
    async execute(input: GetCommentRepliesUseCaseInput): Promise<Comment[]> {
        const page = input.page || 1;
        const limit = input.limit || 10;
        const offset = (page - 1) * limit;

        const parentComment = await this.commentRepository.findById(
            input.commentId,
        );

        if (!parentComment) {
            throw new NotFoundError("Comment not found.");
        }

        return this.commentRepository.findRepliesByParentId(
            input.commentId,
            limit,
            offset,
            input.currentUserId,
        );
    }
}
