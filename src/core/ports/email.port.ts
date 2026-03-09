export interface OtpEmailInput {
    to: string;
    otp: string;
}

export interface EmailPort {
    sendVerificationEmail(input: OtpEmailInput): Promise<void>;
    sendPasswordResetEmail(input: OtpEmailInput): Promise<void>;
}
