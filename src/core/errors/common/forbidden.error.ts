import { CustomError } from "./custom.error";

/**
 * Error representing a 403 Forbidden HTTP response
 * Thrown when a user is authenticated but lacks permission to access a resource
 */
export class ForbiddenError extends CustomError {
    /**
     * Creates a new ForbiddenError instance
     * @param message - Optional error message. Defaults to "Forbidden Error"
     */
    constructor(message = "Forbidden Error") {
        super(message, 403);
    }
}
