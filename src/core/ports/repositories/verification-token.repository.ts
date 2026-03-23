import type { VerificationToken } from "@core/domain/entities/verification-token.entity";
import type { TokenType } from "@core/domain/enums/token-type.enum";

export interface IVerificationTokenRepository {
    upsert(data: {
        userId: string;
        tokenHash: string;
        type: TokenType;
        expiresAt: Date;
    }): Promise<VerificationToken>;
    findByUserIdAndType(
        userId: string,
        type: TokenType,
    ): Promise<VerificationToken | null>;
    delete(id: string): Promise<void>;
}
