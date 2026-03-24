/**
 * Input interface for retrieving the current authenticated user's information.
 *
 * This interface defines the required parameters for fetching the user's
 * profile data and connected OAuth providers.
 */
export interface GetMeUserUseCaseInput {
    /**
     * The unique identifier of the user whose information is being retrieved.
     * This should be the ID of the currently authenticated user.
     */
    id: string;
}
