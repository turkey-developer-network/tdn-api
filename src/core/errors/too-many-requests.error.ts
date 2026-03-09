import { CustomError } from "./custom.error";

export class TooManyRequestsError extends CustomError {
    public readonly statusCode = 429;

    constructor(
        message: string = "Too many requests, please try again later.",
    ) {
        super(message);
    }
}
