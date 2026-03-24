/**
 * Input interface for changing a user's email address.
 *
 * This interface defines the required parameters for updating
 * a user's email address in the system.
 */
export interface ChangeEmailUseCaseInput {
    /**
     * The unique identifier of the user whose email is being changed.
     */
    id: string;

    /**
     * The new email address that will replace the current email.
     * Must be unique and meet email format requirements.
     */
    newEmail: string;
}
