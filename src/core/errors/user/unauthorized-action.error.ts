import { CustomError } from "../common/custom.error";

export class UnauthorizedActionError extends CustomError {
    constructor(
        message = "You do not have permission to perform this action.",
    ) {
        super(message, 403);
    }
}
