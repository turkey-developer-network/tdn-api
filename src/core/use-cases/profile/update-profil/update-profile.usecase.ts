import type { IProfileRepository } from "@core/ports/repositories/profile.repository";
import type { UpdateProfileInput } from "./update-profile-usecase.input";

/**
 * Use case for updating a user's profile information.
 *
 * This use case handles updating various profile fields such as full name,
 * bio, location, and social media links for a specific user.
 */
export class UpdateProfileUseCase {
    /**
     * Creates a new instance of UpdateProfileUseCase.
     *
     * @param profileRepository - Repository for managing profile data
     */
    constructor(private readonly profileRepository: IProfileRepository) {}

    /**
     * Executes the profile update process.
     *
     * @param input - Input containing user ID and optional profile fields to update
     * @returns Promise<void> - Resolves when profile update is complete
     *
     * @remarks
     * This method updates the user's profile with the provided fields.
     * Only the fields that are provided will be updated, leaving other
     * fields unchanged. The update is performed directly on the repository.
     */
    async execute(input: UpdateProfileInput): Promise<void> {
        await this.profileRepository.update(input.userId, input);
    }
}
