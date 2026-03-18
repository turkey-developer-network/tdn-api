import NotFoundError from "@core/errors/not-found.error";
import type { IProfileRepository } from "@core/ports/repositories/profile.repository";
import type { Profile } from "@core/entities/profile.entitiy";

export class GetProfileUseCase {
    constructor(private readonly profileRepository: IProfileRepository) {}

    async execute(username: string): Promise<Profile> {
        const profile = await this.profileRepository.findByUsername(username);

        if (!profile) throw new NotFoundError("Profile not found.");

        return profile;
    }
}
