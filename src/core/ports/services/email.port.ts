/**
 * Base input structure for sending an email.
 */
export interface EmailInput {
    /** The recipient's email address. */
    to: string;
}

/**
 * Input structure for sending an email that contains a one-time password (OTP).
 */
export interface OtpEmailInput extends EmailInput {
    /** The one-time password to include in the email. */
    otp: string;
}

/**
 * Port interface for email delivery operations.
 */
export interface EmailPort {
    /**
     * Sends an email containing an OTP for account verification.
     *
     * @param input - The recipient address and OTP code.
     * @returns A promise that resolves when the email has been sent.
     */
    sendVerificationEmail(input: OtpEmailInput): Promise<void>;

    /**
     * Sends an email containing an OTP for password reset.
     *
     * @param input - The recipient address and OTP code.
     * @returns A promise that resolves when the email has been sent.
     */
    sendPasswordResetEmail(input: OtpEmailInput): Promise<void>;

    /**
     * Sends a confirmation email notifying the user that their account has been deleted.
     *
     * @param input - The recipient address.
     * @returns A promise that resolves when the email has been sent.
     */
    sendDeleteUserEmail(input: EmailInput): Promise<void>;
}
