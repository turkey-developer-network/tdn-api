import { CustomError } from "./custom.error";

export class ForbiddenError extends CustomError {
    constructor(message = "Forbidden Error") {
        super(message, 403);
    }
}
