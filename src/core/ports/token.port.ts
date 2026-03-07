export interface UserPayload {
    id: string;
    username: string;
}

export interface TokenResult {
    accessToken: string;
    expiresAt: number;
}

export interface TokenPort {
    generate(payload: UserPayload): TokenResult;
    verify(token: string): UserPayload;
}
