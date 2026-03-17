export interface UpdateProfileInput {
    userId: string;
    fullName?: string;
    bio?: string | null;
    location?: string | null;
    socials?: Record<string, string> | null;
}
