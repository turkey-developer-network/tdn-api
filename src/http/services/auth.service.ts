import type { User } from "@core/entities/user.entity";
import type { RegisterUseCase } from "@core/use-cases/register-usecase";

export class AuthService {
    constructor(private readonly registerUseCase: RegisterUseCase) {}

    async register(body: {
        email: string;
        username: string;
        password: string;
    }): Promise<User> {
        return await this.registerUseCase.execute(body);
    }
}
