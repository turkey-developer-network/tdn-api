import {
    VerificationToken,
    type TokenType,
} from "@core/entities/verification-token.entity";
import type { VerificationToken as PrismaVerificationToken } from "@generated/prisma/client";

export class VerificationTokenPrismaMapper {
    static toDomain(raw: PrismaVerificationToken): VerificationToken {
        return new VerificationToken(
            raw.id,
            raw.token,
            raw.userId,
            raw.type as TokenType,
            raw.expiresAt,
            raw.createdAt,
        );
    }
}
