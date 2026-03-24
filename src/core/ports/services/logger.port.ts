/**
 * Port interface for logging operations.
 * Following Clean Architecture principles, this interface defines the contract
 * for logging operations without exposing implementation details.
 */
export interface LoggerPort {
    /**
     * Logs an error with an object context and message.
     * @param object - The object context for the error.
     * @param message - The error message.
     */
    error(object: object, message: string): void;
}
