/**
 * Repository interface for comment data operations
 * Handles CRUD operations for comments and nested comment relationships
 */
import type { Comment } from "@core/domain/entities/comment.entity";

export interface ICommentRepository {
    /**
     * Creates a new comment and increments the post's comment count
     * @param comment - The comment entity to create
     * @returns Promise that resolves when the comment is created
     */
    create(comment: Comment): Promise<Comment>;

    /**
     * Finds a comment by its unique identifier
     * @param id - The comment ID to search for
     * @param currentUserId - Optional ID of the current user for like/bookmark status
     * @returns Promise that resolves to the comment or null if not found
     */
    findById(id: string, currentUserId?: string): Promise<Comment | null>;

    /**
     * Retrieves top-level comments for a post (where parentId is null)
     * @param postId - The ID of the post to get comments for
     * @param limit - Maximum number of comments to return
     * @param offset - Number of comments to skip for pagination
     * @param currentUserId - Optional ID of the current user for like/bookmark status
     * @returns Promise that resolves to an array of top-level comments
     */
    findTopLevelByPostId(
        postId: string,
        limit: number,
        offset: number,
        currentUserId?: string,
    ): Promise<Comment[]>;

    /**
     * Retrieves replies for a specific parent comment
     * @param parentId - The ID of the parent comment
     * @param limit - Maximum number of replies to return
     * @param offset - Number of replies to skip for pagination
     * @param currentUserId - Optional ID of the current user for like/bookmark status
     * @returns Promise that resolves to an array of reply comments
     */
    findRepliesByParentId(
        parentId: string,
        limit: number,
        offset: number,
        currentUserId?: string,
    ): Promise<Comment[]>;

    /**
     * Deletes a comment and decrements the post's comment count
     * Note: Cascade will handle replies, but we need to decrement count
     * @param id - The ID of the comment to delete
     * @returns Promise that resolves when the comment is deleted
     */
    delete(id: string): Promise<void>;

    /**
     * Checks whether a user has liked a specific comment
     * @param commentId - The ID of the comment to check
     * @param userId - The ID of the user to check
     * @returns True if the user has liked the comment, false otherwise
     */
    hasUserLiked(commentId: string, userId: string): Promise<boolean>;

    /**
     * Records a like on a comment by a user
     * @param commentId - The ID of the comment to like
     * @param userId - The ID of the user liking the comment
     */
    addLike(commentId: string, userId: string): Promise<void>;

    /**
     * Removes a like from a comment by a user
     * @param commentId - The ID of the comment to unlike
     * @param userId - The ID of the user removing the like
     */
    removeLike(commentId: string, userId: string): Promise<void>;

    /**
     * Increments the cached like count of a comment by one
     * @param commentId - The ID of the comment to update
     */
    incrementLikeCount(commentId: string): Promise<void>;

    /**
     * Decrements the cached like count of a comment by one
     * @param commentId - The ID of the comment to update
     */
    decrementLikeCount(commentId: string): Promise<void>;

    /**
     * Increments the cached reply count of a comment by one
     * @param commentId - The ID of the comment to update
     */
    incrementRepliesCount(commentId: string): Promise<void>;

    /**
     * Decrements the cached reply count of a comment by one
     * @param commentId - The ID of the comment to update
     */
    decrementRepliesCount(commentId: string): Promise<void>;
}
