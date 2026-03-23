import { VerificationToken } from "@core/domain/entities/verification-token.entity";
import type { TokenType } from "@core/domain/enums/token-type.enum";
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
