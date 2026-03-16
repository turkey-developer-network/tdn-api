/**
 * Port interface for password hashing and verification operations.
 */
export interface PasswordPort {
    /**
     * Hashes a plain-text password.
     *
     * @param plain - The plain-text password to hash.
     * @returns A promise that resolves to the hashed password string.
     */
    hash(plain: string): Promise<string>;

    /**
     * Verifies whether a plain-text password matches a given hash.
     *
     * @param plain - The plain-text password to verify.
     * @param hash - The previously hashed password to compare against.
     * @returns A promise that resolves to `true` if the password matches, `false` otherwise.
     */
    verify(plain: string, hash: string): Promise<boolean>;
}
