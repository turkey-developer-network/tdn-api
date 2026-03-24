import type { IProfileRepository } from "@core/ports/repositories/profile.repository";
import type { SearchProfileInput } from "./search-profile-usecase.input";
import type { SearchProfileOutput } from "./search-profile-usecase.output";

/**
 * Use case for searching user profiles.
 *
 * This use case handles searching for user profiles by username or full name
 * with optional result limiting and current user identification.
 */
export class SearchProfilesUseCase {
    /**
     * Creates a new instance of SearchProfilesUseCase.
     *
     * @param profileRepository - Repository for managing profile data
     */
    constructor(private readonly profileRepository: IProfileRepository) {}

    /**
     * Executes the profile search query and maps the 'isMe' flag for each result.
     *
     * @param input - Search input containing query, optional current user ID, and limit
     * @returns Promise<SearchProfileOutput[]> Array of search results with isMe flags
     *
     * @remarks
     * This method trims and validates the search query, requiring at least 2 characters.
     * It searches profiles by username or full name, limits results if specified,
     * and adds an isMe flag to indicate if each result is the current user's profile.
     */
    async execute(input: SearchProfileInput): Promise<SearchProfileOutput[]> {
        const sanitizedQuery = input.query.trim();
        if (sanitizedQuery.length < 2) {
            return [];
        }

        const profiles = await this.profileRepository.search(
            sanitizedQuery,
            input.limit,
        );

        return profiles.map((profile) => ({
            profile,
            isMe: input.currentUserId
                ? profile.userId === input.currentUserId
                : false,
        }));
    }
}
