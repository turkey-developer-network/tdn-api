/**
 * Represents a user profile retrieved from GitHub OAuth.
 */
export interface GithubProfile {
    /** The unique account identifier provided by GitHub. */
    providerAccountId: string;

    /** The GitHub username of the authenticated user. */
    username: string;

    /** The primary email address associated with the GitHub account. */
    email: string;

    /** Indicates whether the user's email address has been verified by GitHub. */
    isEmailVerified: boolean;
}

/**
 * Port interface for GitHub OAuth authentication operations.
 */
export interface GithubAuthPort {
    /**
     * Generates the GitHub OAuth authorization URL to redirect the user to.
     *
     * @returns The full authorization URL including required query parameters.
     */
    getAuthorizationUrl(): string;

    /**
     * Exchanges an authorization code for tokens and retrieves the authenticated user's profile.
     *
     * @param code - The authorization code received from GitHub after user consent.
     * @returns A promise that resolves to the authenticated user's GitHub profile.
     * @throws {OAuthProviderError} If the token exchange or profile fetch fails.
     */
    getUserProfileByCode(code: string): Promise<GithubProfile>;
}
