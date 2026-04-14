/**
 * Input data transfer object for the ResetPassword use case
 * @remarks This input is expected to be used after the user has initiated a password reset request and received an OTP (One-Time Password) via email. The user will then provide their email, the OTP they received, and their desired new password to complete the password reset process.
 */
export interface ResetPasswordInput {
    /**
     * The email address of the account for which the password reset is being performed. This should match the email address that was used to initiate the password reset request and receive the OTP.
     */
    email: string;
    /**
     * The One-Time Password (OTP) that was sent to the user's email address as part of the password reset process. This OTP is used to verify that the person attempting to reset the password has access to the email account associated with the user account. The OTP is typically a short, time-limited code that must be provided along with the new password to successfully reset the password.
     */
    otp: string;
    /**
     * The new password that the user wants to set for their account. This should be a plain-text password that will be validated and then hashed before being stored in the database. The new password should meet any password complexity requirements defined by the application (e.g., minimum length, inclusion of special characters, etc.) to ensure account security.
     */
    newPassword: string;
}
