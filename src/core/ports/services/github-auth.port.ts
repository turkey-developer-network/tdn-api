export interface OAuthGithubProfile {
    providerAccountId: string;
    username: string;
    email: string;
}

export interface GithubAuthPort {
    getAuthorizationUrl(): string;
    getUserProfileByCode(code: string): Promise<OAuthGithubProfile>;
}
