import { BadRequestError } from "@core/errors";
import type { IFollowRepository } from "@core/ports/repositories/follow.repository";

export class FollowUserUseCase {
    constructor(private readonly followUserRepository: IFollowRepository) {}

    async execute(currentUserId: string, targetId: string): Promise<void> {
        if (currentUserId === targetId)
            throw new BadRequestError("You cannot follow yourself.");

        const isFollowing = await this.followUserRepository.checkIsFollowing(
            currentUserId,
            targetId,
        );

        if (isFollowing) return;

        await this.followUserRepository.followUser(currentUserId, targetId);
    }
}
