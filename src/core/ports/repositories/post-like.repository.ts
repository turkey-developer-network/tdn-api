/**
 * Repository interface for managing post like relationships
 *
 * Defines the contract for persisting and retrieving post like data.
 * Following Clean Architecture principles, this interface ensures
 * separation between the domain layer and persistence implementation.
 */
export interface IPostLikeRepository {
    /**
     * Creates a like relationship between a user and a post
     * @param postId - The unique identifier of the post
     * @param userId - The unique identifier of the user
     * @returns Promise<void>
     */
    like(postId: string, userId: string): Promise<void>;

    /**
     * Checks if a user has already liked a specific post
     * @param postId - The unique identifier of the post
     * @param userId - The unique identifier of the user
     * @returns Promise<boolean> - True if the user has liked the post, false otherwise
     */
    isLiked(postId: string, userId: string): Promise<boolean>;

    /**
     * Removes a like relationship between a user and a post
     * @param postId - The unique identifier of the post
     * @param userId - The unique identifier of the user
     * @returns Promise<void>
     */
    unlike(postId: string, userId: string): Promise<void>;

    /**
     * Increments the like count for a post atomically
     * @param postId - The ID of the post to increment like count for
     * @returns Promise<void>
     */
    incrementLikeCount(postId: string): Promise<void>;

    /**
     * Decrements the like count for a post atomically
     * @param postId - The ID of the post to decrement like count for
     * @returns Promise<void>
     */
    decrementLikeCount(postId: string): Promise<void>;
}
