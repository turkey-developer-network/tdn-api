import { BadRequestError } from "@core/errors";
import NotFoundError from "@core/errors/not-found.error";
import type { IFollowRepository } from "@core/ports/repositories/follow.repository";
import type { IProfileRepository } from "@core/ports/repositories/profile.repository";

export class UnfollowUserUseCase {
    constructor(
        private readonly followUserRepository: IFollowRepository,
        private readonly profileRepository: IProfileRepository,
    ) {}

    async execute(currentUserId: string, targetId: string): Promise<void> {
        const targetProfile =
            await this.profileRepository.findByUserId(targetId);
        if (!targetProfile) throw new NotFoundError("User not found.");

        if (currentUserId === targetProfile.userId) {
            throw new BadRequestError("You cannot unfollow yourself.");
        }
        const isFollowing = await this.followUserRepository.checkIsFollowing(
            currentUserId,
            targetProfile.userId,
        );

        if (!isFollowing) return;

        await this.followUserRepository.unfollowUser(
            currentUserId,
            targetProfile.userId,
        );
    }
}
