/**
 * Input interface for Google OAuth login.
 *
 * This interface defines the required parameters for authenticating
 * a user through Google OAuth flow.
 */
export interface GoogleLoginInput {
    /**
     * The authorization code received from Google OAuth callback.
     * This code is used to exchange for user profile information.
     */
    code: string;

    /**
     * The IP address of the device making the login request.
     * Used for security logging and tracking.
     */
    deviceIp: string;

    /**
     * The user agent string of the device making the login request.
     * Used for security logging and device identification.
     */
    userAgent: string;
}
