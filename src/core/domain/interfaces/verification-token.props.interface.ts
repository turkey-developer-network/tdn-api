import type { TokenType } from "@core/domain/enums";

/**
 * Props interface for VerificationToken entity
 *
 * Represents the properties required to create or update a verification token.
 * Verification tokens are used for email verification, password reset,
 * and other account verification processes within the application.
 */
export interface VerificationTokenProps {
    /** Unique identifier for the verification token */
    id?: string;

    /** Hashed value of the verification token for security */
    tokenHash: string;

    /** The unique identifier of the user associated with this token */
    userId: string;

    /** The type of verification this token is for (email verification, password reset, etc.) */
    type: TokenType;

    /** Expiration timestamp when this token becomes invalid */
    expiresAt: Date;

    /** Creation timestamp of the verification token */
    createdAt?: Date;
}
