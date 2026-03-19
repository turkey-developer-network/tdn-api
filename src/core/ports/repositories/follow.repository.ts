export interface IFollowRepository {
    /**
     * Checks if a user is following another user.
     * @param followerId - The ID of the user who might be following.
     * @param followingId - The ID of the user being followed.
     * @returns A boolean indicating if the follow relationship exists.
     */
    checkIsFollowing(followerId: string, followingId: string): Promise<boolean>;
    /**
     * Creates a follow relationship between two users.
     * @param followerId - The ID of the user initiating the follow (Current User).
     * @param followingId - The ID of the user being followed (Target User).
     */
    followUser(followerId: string, followingId: string): Promise<void>;

    /**
     * Removes a follow relationship between two users.
     * @param followerId - The ID of the user who is currently following.
     * @param followingId - The ID of the user being unfollowed.
     */
    unfollowUser(followerId: string, followingId: string): Promise<void>;
}
