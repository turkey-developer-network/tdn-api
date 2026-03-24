import { BadRequestError, NotFoundError } from "@core/errors";
import type { IFollowRepository } from "@core/ports/repositories/follow.repository";
import type { IProfileRepository } from "@core/ports/repositories/profile.repository";

/**
 * Use case for unfollowing another user.
 *
 * This use case handles the process of removing a follow relationship
 * between two users.
 */
export class UnfollowUserUseCase {
    /**
     * Creates a new instance of UnfollowUserUseCase.
     *
     * @param followUserRepository - Repository for managing follow relationships
     * @param profileRepository - Repository for managing user profiles
     */
    constructor(
        private readonly followUserRepository: IFollowRepository,
        private readonly profileRepository: IProfileRepository,
    ) {}

    /**
     * Executes the unfollow user process.
     *
     * @param currentUserId - The ID of the user initiating the unfollow
     * @param targetId - The ID of the user to be unfollowed
     * @returns Promise<void> - Resolves when unfollow operation is complete
     *
     * @throws NotFoundError - When the target user is not found
     * @throws BadRequestError - When user tries to unfollow themselves
     *
     * @remarks
     * If the user is not following the target, the method returns silently.
     * Otherwise, it removes the follow relationship from the database.
     */
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
