import type { IFollowRepository } from "@core/ports/repositories/follow.repository";
import type { FollowListItem } from "../get-followers/get-followers.usecase";

export class GetFollowingUseCase {
    constructor(private readonly followUserRepository: IFollowRepository) {}

    async execute(
        targetId: string,
        currentUserId: string | undefined,
        limit: number,
        offset: number,
    ): Promise<FollowListItem[]> {
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
