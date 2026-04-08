import { CustomError } from "./custom.error";

/**
 * Error thrown when the upstream translation service fails.
 *
 * This indicates a problem communicating with the external translation API
 * (e.g. invalid API key, rate limited, or API unavailable).
 */
export class TranslationFailedError extends CustomError {
    constructor(
        message = "Translation service failed. Please try again later.",
    ) {
        super(message, 502);
    }
}
