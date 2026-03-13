import type { IVerificationTokenRepository } from "@core/ports/repositories/verification-token.repository";
import type {
    VerificationToken,
    TokenType,
} from "@core/entities/verification-token.entity";
import { VerificationTokenPrismaMapper } from "../mappers/verification-token.prisma.mapper";
import type { PrismaTransactionalClient } from "../database/prisma-client.type";

export class PrismaVerificationTokenRepository implements IVerificationTokenRepository {
    constructor(private readonly prisma: PrismaTransactionalClient) {}

    async upsert(data: {
        userId: string;
        tokenHash: string;
        type: TokenType;
        expiresAt: Date;
    }): Promise<VerificationToken> {
        const rawToken = await this.prisma.verificationToken.upsert({
            where: {
                userId_type: {
                    userId: data.userId,
                    type: data.type,
                },
            },
            update: {
                token: data.tokenHash,
                expiresAt: data.expiresAt,
            },
            create: {
                userId: data.userId,
                token: data.tokenHash,
                type: data.type,
                expiresAt: data.expiresAt,
            },
        });

        return VerificationTokenPrismaMapper.toDomain(rawToken);
    }

    async findByUserIdAndType(
        userId: string,
        type: TokenType,
    ): Promise<VerificationToken | null> {
        const rawToken = await this.prisma.verificationToken.findUnique({
            where: {
                userId_type: { userId, type },
            },
        });

        if (!rawToken) return null;
        return VerificationTokenPrismaMapper.toDomain(rawToken);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.verificationToken.delete({
            where: { id },
        });
    }
}
