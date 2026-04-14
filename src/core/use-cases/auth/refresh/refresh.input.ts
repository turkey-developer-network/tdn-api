/**
 * Input data transfer object for the Refresh use case
 * Includes the refresh token and additional context for security purposes
 * such as device IP and user agent to help detect suspicious activity
 */
export interface RefreshInput {
    /**
     * The refresh token issued during login, used to obtain a new access token
     */
    token: string;
    /**
     * The IP address of the device making the refresh request, used for security monitoring
     */
    deviceIp: string;
    /**
     * The user agent string of the device making the refresh request, used for security monitoring
     */
    userAgent: string;
}
