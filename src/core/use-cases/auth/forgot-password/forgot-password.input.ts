/**
 * Input data transfer object for the ForgotPassword use case
 */
export interface ForgotPasswordInput {
    /**
     * The email address of the account to send the password reset link to
     */
    email: string;
}
