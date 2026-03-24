/**
 * Input interface for soft deleting a user account.
 *
 * This interface defines the required parameters for the soft delete operation,
 * including user identification and password validation for security.
 */
export interface SoftDeleteUserUseCaseInput {
    /**
     * The unique identifier of the user whose account is being soft deleted.
     */
    id: string;

    /**
     * The user's current password for validation purposes.
     * This will be verified against the stored password hash before allowing the deletion.
     */
    password: string;
}
