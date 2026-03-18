import type { IProfileRepository } from "@core/ports/repositories/profile.repository";
import type { Profile } from "@core/entities/profile.entitiy";

export interface SearchProfileResult {
    profile: Profile;
    isMe: boolean;
}

export class SearchProfilesUseCase {
    constructor(private readonly profileRepository: IProfileRepository) {}

    /**
     * Executes the profile search query and maps the 'isMe' flag for each result.
     * @param query - The search text (username or full name).
     * @param currentUserId - (Optional) The ID of the user making the request.
     * @param limit - (Optional) Maximum number of results.
     */
    async execute(
        query: string,
        currentUserId?: string,
        limit: number = 10,
    ): Promise<SearchProfileResult[]> {
        const sanitizedQuery = query.trim();
        if (sanitizedQuery.length < 2) {
            return [];
        }

        const profiles = await this.profileRepository.search(
            sanitizedQuery,
            limit,
        );

        return profiles.map((profile) => ({
            profile,
            isMe: currentUserId ? profile.userId === currentUserId : false,
        }));
    }
}
