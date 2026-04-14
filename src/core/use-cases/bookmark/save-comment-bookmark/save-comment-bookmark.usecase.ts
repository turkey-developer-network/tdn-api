import { NotFoundError } from "@core/errors";
import type { ICommentRepository } from "@core/ports/repositories/comment.repository";
import type { ICommentBookmarkRepository } from "@core/ports/repositories/comment-bookmark.repository";
import type { SaveCommentBookmarkInput } from "./save-comment-bookmark.input";

/**
 * Use case for saving a bookmark for a comment for a specific user. This use case checks if the comment exists and if the bookmark already exists before attempting to save it, ensuring that appropriate errors are thrown if the comment is not found. If the bookmark does not already exist, it will be saved to the repository.
 */
export class SaveCommentBookmarkUseCase {
    /**
     * @param commentRepository - Repository for accessing comment data, used to verify the existence of the comment before attempting to save a bookmark
     * @param commentBookmarkRepository - Repository for managing comment bookmarks, used to check for the existence of the bookmark and to save it if it does not already exist
     */
    constructor(
        private readonly commentRepository: ICommentRepository,
        private readonly commentBookmarkRepository: ICommentBookmarkRepository,
    ) {}
    /**
     * Executes the use case to save a bookmark for a comment based on the provided input
     * @param input - The input containing the comment ID and user ID to identify which bookmark to save
     * @throws NotFoundError if the comment does not exist
     * @returns void if the bookmark is successfully saved or if it already exists
     */
    async execute(input: SaveCommentBookmarkInput): Promise<void> {
        const comment = await this.commentRepository.findById(input.commentId);
        if (!comment) {
            throw new NotFoundError("Comment not found.");
        }

        const alreadyBookmarked =
            await this.commentBookmarkRepository.isBookmarked(
                input.commentId,
                input.userId,
            );

        if (alreadyBookmarked) return;

        await this.commentBookmarkRepository.save(
            input.commentId,
            input.userId,
        );
    }
}
