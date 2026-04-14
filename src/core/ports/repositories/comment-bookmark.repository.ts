import type { Comment } from "@core/domain/entities/comment.entity";

/**
 * Repository interface for managing comment bookmark operations
 * Handles persisting and querying bookmark relationships between users and comments
 */
export interface ICommentBookmarkRepository {
    /**
     * Saves a bookmark for a comment by a user
     * @param commentId - The ID of the comment to bookmark
     * @param userId - The ID of the user bookmarking the comment
     */
    save(commentId: string, userId: string): Promise<void>;

    /**
     * Removes a bookmark for a comment by a user
     * @param commentId - The ID of the comment to unbookmark
     * @param userId - The ID of the user removing the bookmark
     */
    remove(commentId: string, userId: string): Promise<void>;

    /**
     * Checks whether a user has bookmarked a specific comment
     * @param commentId - The ID of the comment to check
     * @param userId - The ID of the user to check
     * @returns True if the comment is bookmarked by the user, false otherwise
     */
    isBookmarked(commentId: string, userId: string): Promise<boolean>;

    /**
     * Retrieves a paginated list of comments bookmarked by a specific user
     * @param userId - The ID of the user whose bookmarks are being retrieved
     * @param limit - The maximum number of comments to return
     * @param offset - The number of comments to skip for pagination
     * @returns An object containing the list of bookmarked comments and the total count
     */
    findBookmarkedByUserId(
        userId: string,
        limit: number,
        offset: number,
    ): Promise<{ comments: Comment[]; total: number }>;
}
