/**
 * Input data transfer object for the VerifyEmail use case
 *
 */
export interface VerifyEmailInput {
    /**
     * The ID of the user to verify the email for
     */
    userId: string;
    /**
     * The one-time password (OTP) sent to the user's email
     */
    otp: string;
}
