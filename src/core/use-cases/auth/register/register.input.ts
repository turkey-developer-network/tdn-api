/**
 * Input data transfer object for the Register use case
 * This interface defines the structure of the data required to register a new user, including their email, username, and password.
 * The email and username should be unique across the system, and the password should meet the security requirements defined by the application (e.g. minimum length, complexity).
 * This input will be validated before being processed by the Register use case, ensuring that all required fields are present and correctly formatted
 */
export interface RegisterInput {
    /**
     * The email address of the new user to be registered. This should be a valid email format and must not already be associated with an existing account in the system.
     */
    email: string;
    /**
     * The desired username for the new user. This should be a unique identifier that is not already taken by another user in the system. The username may have specific formatting requirements (e.g. allowed characters, length) as defined by the application.
     */
    username: string;
    /**
     * The plain-text password for the new user. This should meet the security requirements defined by the application, such as a minimum length and complexity (e.g. including uppercase letters, numbers, special characters). The password will be securely hashed before being stored in the database.
     */
    password: string;
}
