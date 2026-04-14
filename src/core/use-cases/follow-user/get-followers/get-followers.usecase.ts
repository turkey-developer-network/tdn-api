import type { IFollowRepository } from "@core/ports/repositories/follow.repository";
import type { GetFollowersUseCaseOutput } from "./get-followers-usecase.output";
import type { GetFollowersUseCaseInput } from "./get-followers-usecase.input";
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
     * Executes the get followers use case.
     * @param input - The input data for the use case, including the target user's ID, the current user's ID, and pagination parameters.
     * @returns A promise that resolves to an array of followers, each containing user information and follow status.
     */
    async execute(
        input: GetFollowersUseCaseInput,
    ): Promise<GetFollowersUseCaseOutput[]> {
        const { targetId, currentUserId, limit, offset } = input;

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
