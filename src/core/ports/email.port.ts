export interface SendVerificationEmailInput {
    to: string;
    otp: string;
}

export interface EmailPort {
    sendVerificationEmail(input: SendVerificationEmailInput): Promise<void>;
}
