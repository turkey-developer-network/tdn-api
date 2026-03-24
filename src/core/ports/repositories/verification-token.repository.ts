import type { VerificationToken } from "@core/domain/entities/verification-token.entity";
import type { TokenType } from "@core/domain/enums/token-type.enum";

/**
 * Repository interface for managing VerificationToken entities.
 * Following Clean Architecture principles, this interface defines the contract
 * for persisting and retrieving VerificationToken domain entities without exposing
 * implementation details or DTOs.
 */
export interface IVerificationTokenRepository {
    /**
     * Creates or updates a verification token entity in the persistence layer.
     * @param data - The verification token data including user ID, token hash, type, and expiration.
     * @returns The created or updated VerificationToken entity.
     */
    upsert(data: {
        userId: string;
        tokenHash: string;
        type: TokenType;
        expiresAt: Date;
    }): Promise<VerificationToken>;

    /**
     * Retrieves a verification token by user ID and token type.
     * @param userId - The unique identifier of the user.
     * @param type - The type of verification token.
     * @returns The VerificationToken entity if found, otherwise null.
     */
    findByUserIdAndType(
        userId: string,
        type: TokenType,
    ): Promise<VerificationToken | null>;

    /**
     * Deletes a verification token by its unique identifier.
     * @param id - The unique identifier of the verification token.
     */
    delete(id: string): Promise<void>;
}
