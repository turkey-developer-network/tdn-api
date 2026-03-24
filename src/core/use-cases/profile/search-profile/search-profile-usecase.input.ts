/**
 * Input interface for searching user profiles.
 *
 * This interface defines the required and optional parameters for
 * searching user profiles by username or full name.
 */
export interface SearchProfileInput {
    /**
     * The search query string to match against usernames or full names.
     * Must be at least 2 characters long.
     */
    query: string;

    /**
     * Optional unique identifier of the current user making the search.
     * Used to identify if search results include the current user's profile.
     */
    currentUserId?: string;

    /**
     * Optional maximum number of results to return.
     * If not provided, all matching results will be returned.
     */
    limit?: number;
}
