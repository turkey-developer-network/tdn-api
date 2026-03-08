import type { PrismaClient } from "@generated/prisma/client";
import type { IRefreshTokenRepository } from "@core/repositories/refresh-token.repository";
import type { RefreshToken } from "@core/entities/refresh-token.entity";
import { RefreshTokenPrismaMapper } from "@infrastructure/mappers/refresh-token.prisma.mapper";
export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async create(data: {
        token: string;
        userId: string;
        deviceIp: string;
        userAgent: string;
        expiresAt: Date;
    }): Promise<RefreshToken> {
        const rawToken = await this.prisma.refreshToken.create({
            data: {
                token: data.token,
                userId: data.userId,
                deviceIp: data.deviceIp,
                userAgent: data.userAgent,
                expiresAt: data.expiresAt,
            },
        });

        return RefreshTokenPrismaMapper.toDomain(rawToken);
    }
}
