/**
 * Input interface for changing a user's username.
 *
 * This interface defines the required parameters for updating
 * a user's username in the system.
 */
export interface ChangeUsernameUseCaseInput {
    /**
     * The unique identifier of the user whose username is being changed.
     */
    id: string;

    /**
     * The new username that will replace the current username.
     * Must be unique and meet system requirements.
     */
    newUsername: string;
}
