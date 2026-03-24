import type { Profile } from "@core/domain/entities/profile.entity";

/**
 * Output interface for profile search results.
 *
 * This interface defines the structure of the data returned when searching
 * for user profiles, including the profile information and whether it's
 * the current user's own profile.
 */
export interface SearchProfileOutput {
    /**
     * The profile entity matching the search criteria.
     */
    profile: Profile;

    /**
     * Indicates whether the searched profile belongs to the current user.
     */
    isMe: boolean;
}
