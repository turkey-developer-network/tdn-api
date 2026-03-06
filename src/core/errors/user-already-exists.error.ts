import { CustomError } from "./custom.error";

export class UserAlreadyExistsError extends CustomError {
    constructor() {
        super("A user with these details already exists.", 409);
    }
}
