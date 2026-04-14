/**
 * Input data transfer object for the Logout use case
 */
export interface LogoutInput {
    /**
     * The refresh token to invalidate upon logout
     */
    token: string;
}
