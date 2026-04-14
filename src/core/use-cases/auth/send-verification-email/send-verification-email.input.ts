/**
 * Input data transfer object for the SendVerificationEmail use case
 */
export interface SendVerificationEmailInput {
    /**
     * The ID of the user to send the verification email to
     */
    userId: string;
}
