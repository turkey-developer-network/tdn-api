import { CustomError } from "../common/custom.error";

export class OAuthProviderError extends CustomError {
    constructor(message = "An error occurred during authorization.") {
        super(message, 502);
    }
}
