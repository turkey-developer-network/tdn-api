import { NotFoundError } from "@core/errors";
import type { ICommentRepository } from "@core/ports/repositories/comment.repository";
import type { ICommentBookmarkRepository } from "@core/ports/repositories/comment-bookmark.repository";
import type { RemoveCommentBookmarkInput } from "./remove-comment-bookmark.input";

/**
 * Use case for removing a bookmark from a comment for a specific user. This use case checks if the comment exists and if the bookmark exists before attempting to remove it, ensuring that appropriate errors are thrown if the comment is not found or if the bookmark does not exist. If the bookmark exists, it will be removed from the repository.
 */
export class RemoveCommentBookmarkUseCase {
    /**
     * @param commentRepository - Repository for accessing comment data, used to verify the existence of the comment before attempting to remove a bookmark
     * @param commentBookmarkRepository - Repository for managing comment bookmarks, used to check for the existence of the bookmark and to remove it if it exists
     */
    constructor(
        private readonly commentRepository: ICommentRepository,
        private readonly commentBookmarkRepository: ICommentBookmarkRepository,
    ) {}

    /**
     * Executes the use case to remove a bookmark from a comment based on the provided input
     * @param input - The input containing the comment ID and user ID to identify which bookmark to remove
     * @throws NotFoundError if the comment does not exist
     * @returns void if the bookmark is successfully removed or if it did not exist in the first place
     */
    async execute(input: RemoveCommentBookmarkInput): Promise<void> {
        const comment = await this.commentRepository.findById(input.commentId);
        if (!comment) {
            throw new NotFoundError("Comment not found.");
        }

        const hasBookmark = await this.commentBookmarkRepository.isBookmarked(
            input.commentId,
            input.userId,
        );

        if (hasBookmark) {
            await this.commentBookmarkRepository.remove(
                input.commentId,
                input.userId,
            );
        }
    }
}
