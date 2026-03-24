import type { IFollowRepository } from "@core/ports/repositories/follow.repository";

/**
 * Interface representing a follow list item with user information.
 */
export interface FollowListItem {
    userId: string;
    username: string;
    fullName: string;
    avatarUrl: string;
    bio: string | null;
    isFollowing: boolean;
    isMe: boolean;
}

/**
 * Use case for retrieving followers of a user.
 *
 * This use case handles fetching a list of users who follow a specific user,
 * including follow status information for the current user.
 */
export class GetFollowersUseCase {
    /**
     * Creates a new instance of GetFollowersUseCase.
     *
     * @param followUserRepository - Repository for managing follow relationships
     */
    constructor(private readonly followUserRepository: IFollowRepository) {}

    /**
     * Executes the get followers process.
     *
     * @param targetId - The ID of the user whose followers to retrieve
     * @param currentUserId - The ID of the current user (optional, for follow status)
     * @param limit - Maximum number of followers to return
     * @param offset - Number of followers to skip (for pagination)
     * @returns Promise<FollowListItem[]> - List of followers with follow status
     *
     * @remarks
     * If no followers are found, returns an empty array.
     * If currentUserId is provided, the isFollowing field indicates whether
     * the current user follows each listed user.
     */
    async execute(
        targetId: string,
        currentUserId: string | undefined,
        limit: number,
        offset: number,
    ): Promise<FollowListItem[]> {
        const followers = await this.followUserRepository.getFollowers(
            targetId,
            limit,
            offset,
        );

        if (followers.length === 0) return [];

        let followedIds = new Set<string>();

        if (currentUserId) {
            const listedUserIds = followers.map((f) => f.userId);
            const followedArray =
                await this.followUserRepository.checkIsFollowingBulk(
                    currentUserId,
                    listedUserIds,
                );

            followedIds = new Set(followedArray);
        }

        return followers.map((f) => ({
            ...f,
            isFollowing: currentUserId ? followedIds.has(f.userId) : false,
            isMe: currentUserId === f.userId,
        }));
    }
}
