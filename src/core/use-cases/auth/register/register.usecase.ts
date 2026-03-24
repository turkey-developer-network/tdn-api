import type { PasswordPort } from "@core/ports/services/password.port";
import type { User } from "@core/domain/entities/user.entity";
import type { CreateUserUseCase } from "@core/use-cases/user/create-user/create-user.usecase";
import type { RegisterInput } from "./register.input";

/**
 * Use case for user registration.
 *
 * This use case handles the complete user registration process including
 * password hashing and user creation.
 */
export class RegisterUseCase {
    /**
     * Creates a new instance of RegisterUseCase.
     *
     * @param createUserUseCase - Use case for creating user entities
     * @param passwordService - Service for password hashing
     */
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly passwordService: PasswordPort,
    ) {}

    /**
     * Executes the user registration process.
     *
     * @param input - Registration input containing username, email, and password
     * @returns Promise<User> The created user entity
     *
     * @throws Will throw an error if user creation fails
     *
     * @remarks
     * This method hashes the password before creating the user to ensure
     * password security.
     */
    async execute(input: RegisterInput): Promise<User> {
        const passwordHash = await this.passwordService.hash(input.password);

        return this.createUserUseCase.execute({
            username: input.username,
            email: input.email,
            passwordHash,
        });
    }
}
