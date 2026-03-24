import type { IUserRepository } from "@core/ports/repositories/user.repository";

/**
 * Use case for purging expired users from the system.
 *
 * This use case is responsible for cleaning up expired user accounts from the database.
 * It's typically used as part of a scheduled cleanup process to maintain system performance
 * and remove accounts that have been pending deletion for too long.
 */
export class PurgeExpiredUsersUseCase {
    /**
     * Creates a new instance of PurgeExpiredUsersUseCase.
     *
     * @param userRepository - Repository for managing user data
     */
    constructor(private readonly userRepository: IUserRepository) {}

    /**
     * Executes the purge operation to remove expired users.
     *
     * @returns Promise<number> The number of expired users that were deleted
     *
     * @remarks
     * This method delegates to the user repository to delete users that have
     * been marked for deletion and have exceeded their grace period.
     */
    async execute(): Promise<number> {
        return this.userRepository.deleteExpiredUser();
    }
}
