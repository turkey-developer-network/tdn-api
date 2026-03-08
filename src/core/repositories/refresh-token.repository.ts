import type { RefreshToken } from "../entities/refresh-token.entity";

export interface IRefreshTokenRepository {
    create(data: {
        token: string;
        userId: string;
        deviceIp: string;
        userAgent: string;
        expiresAt: Date;
    }): Promise<RefreshToken>;
}
