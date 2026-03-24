import type { UserPayload } from "@core/ports/services/auth-token.port";

export interface LoginOutput {
    user: UserPayload;
    tokens: {
        accessToken: string;
        expiresAt: number;
        refreshToken: string;
        refreshTokenExpiresAt: Date;
    };
}
