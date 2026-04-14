import type { ICommentRepository } from "@core/ports/repositories/comment.repository";
import type { IPostRepository } from "@core/ports/repositories/post.repository";
import { NotFoundError } from "@core/errors";
import type { Comment } from "@core/domain/entities/comment.entity";
import type { GetPostCommentsUseCaseInput } from "./get-post-comments.input";

/**
 * Use case for retrieving the top-level comments of a specific post. This use case first checks if the post exists before attempting to retrieve its comments, ensuring that an appropriate error is thrown if the post is not found or has been deleted. If the post exists, it retrieves the top-level comments based on the provided pagination parameters and optional current user context.
 */
export class GetPostCommentsUseCase {
    /**
     * @param commentRepository - Repository for accessing comment data, used to retrieve the top-level comments of the specified post based on the provided input parameters
     * @param postRepository - Repository for accessing post data, used to verify the existence of the specified post before attempting to retrieve its comments
     */
    constructor(
        private readonly commentRepository: ICommentRepository,
        private readonly postRepository: IPostRepository,
    ) {}

    /**
     * Executes the use case to retrieve the top-level comments of a post based on the provided input
     * @param input - The input containing the post ID, pagination parameters, and an optional current user ID for additional context
     * @throws NotFoundError if the post does not exist or has been deleted
     * @returns An array of comments representing the top-level comments of the specified post, including any relevant information based on the current user context
     */
    async execute(input: GetPostCommentsUseCaseInput): Promise<Comment[]> {
        const page = input.page || 1;
        const limit = input.limit || 10;
        const offset = (page - 1) * limit;

        const postExists = await this.postRepository.findById(input.postId);
        if (!postExists) {
            throw new NotFoundError(
                "The post was either not found or has been deleted.",
            );
        }

        const comments = await this.commentRepository.findTopLevelByPostId(
            input.postId,
            limit,
            offset,
            input.currentUserId,
        );

        return comments;
    }
}
