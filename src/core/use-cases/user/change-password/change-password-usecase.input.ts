/**
 * Input interface for changing a user's password.
 *
 * This interface defines the required parameters for the password change operation,
 * including validation of the current password and specification of the new password.
 */
export interface ChangePasswordUseCaseInput {
    /**
     * The unique identifier of the user whose password is being changed.
     */
    id: string;

    /**
     * The user's current password for validation purposes.
     * This will be verified against the stored password hash before allowing the change.
     */
    currentPassword: string;

    /**
     * The new password that will replace the current password.
     * Must be different from the current password and meet security requirements.
     */
    newPassword: string;
}
