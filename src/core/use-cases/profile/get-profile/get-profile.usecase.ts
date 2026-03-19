import NotFoundError from "@core/errors/not-found.error";
import type { IProfileRepository } from "@core/ports/repositories/profile.repository";
import type { IFollowRepository } from "@core/ports/repositories/follow.repository";
import type { GetProfileOutput } from "./get-profile-usecase.output";

export class GetProfileUseCase {
    constructor(
        private readonly profileRepository: IProfileRepository,
        private readonly followUserRepository: IFollowRepository,
    ) {}

    async execute(
        username: string,
        currentUserId?: string,
    ): Promise<GetProfileOutput> {
        const profile = await this.profileRepository.findByUsername(username);

        if (!profile) throw new NotFoundError("Profile not found.");

        const isMe = currentUserId ? profile.userId === currentUserId : false;

        let isFollowing = false;
        if (currentUserId && !isMe) {
            isFollowing = await this.followUserRepository.checkIsFollowing(
                currentUserId,
                profile.userId,
            );
        }

        return {
            profile,
            isMe,
            isFollowing,
        };
    }
}
