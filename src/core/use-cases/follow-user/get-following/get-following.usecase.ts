import type { IFollowRepository } from "@core/ports/repositories/follow.repository";
import type { GetFollowingUseCaseOutput } from "./get-following-usecase.output";
import type { GetFollowingUseCaseInput } from "./get-following-usecase.input";

export class GetFollowingUseCase {
    /**
     * Creates a new instance of GetFollowingUseCase.
     *
     * @param followUserRepository - Repository for managing follow relationships
     */
    constructor(private readonly followUserRepository: IFollowRepository) {}

    /**
     * Executes the get following use case.
     * @param input - The input data for the use case, including the target user's ID, the current user's ID, and pagination parameters.
     * @returns A promise that resolves to an array of following users, each containing user information and follow status.
     * The use case retrieves the list of users that the target user is following, checks if the current user follows each of those users, and returns an array of following users with their information and follow status relative to the current user.
     */
    async execute(
        input: GetFollowingUseCaseInput,
    ): Promise<GetFollowingUseCaseOutput[]> {
        const { targetId, currentUserId, limit, offset } = input;

        const following = await this.followUserRepository.getFollowing(
            targetId,
            limit,
            offset,
        );

        if (following.length === 0) return [];

        let followedIds = new Set<string>();

        if (currentUserId) {
            const listedUserIds = following.map((f) => f.userId);
            const followedArray =
                await this.followUserRepository.checkIsFollowingBulk(
                    currentUserId,
                    listedUserIds,
                );
            followedIds = new Set(followedArray);
        }

        return following.map((f) => ({
            ...f,
            isFollowing: currentUserId ? followedIds.has(f.userId) : false,
            isMe: currentUserId === f.userId,
        }));
    }
}
