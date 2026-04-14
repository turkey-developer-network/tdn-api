/**
 * Input data transfer object for the Login use case
 */
export interface LoginInput {
    /**
     * The user's identifier for login (e.g. username or email)
     */
    identifier: string;

    /**
     * The user's plain-text password to verify against the stored hash
     */
    password: string;

    /**
     * The user agent string of the device making the login request
     */
    userAgent: string;

    /**
     * The IP address of the device making the login request
     */
    deviceIp: string;
}
