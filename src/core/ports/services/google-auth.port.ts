/**
 * Represents a user profile retrieved from Google OAuth.
 */
export interface GoogleProfile {
    /** The unique account identifier provided by Google. */
    providerAccountId: string;

    /** The primary email address associated with the Google account. */
    email: string;

    /** The derived username based on the user's Google email address. */
    username: string;
}

/**
 * Port interface for Google OAuth authentication operations.
 */
export interface GoogleAuthPort {
    /**
     * Generates the Google OAuth authorization URL to redirect the user to.
     *
     * @returns The full authorization URL including required query parameters.
     */
    getAuthorizationUrl(): string;

    /**
     * Exchanges an authorization code for tokens and retrieves the authenticated user's profile.
     *
     * @param code - The authorization code received from Google after user consent.
     * @returns A promise that resolves to the authenticated user's Google profile.
     * @throws {OAuthProviderError} If the token exchange or profile fetch fails.
     */
    getUserProfileByCode(code: string): Promise<GoogleProfile>;
}
