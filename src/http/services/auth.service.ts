import type { User } from "@core/entities/user.entity";
import type { RegisterUseCase } from "@core/use-cases/register-usecase";
import type { RegisterResponseData } from "@typings/schemas/auth.schema";

export class AuthService {
    constructor(private readonly registerUseCase: RegisterUseCase) {}

    async register(body: {
        email: string;
        username: string;
        password: string;
    }): Promise<RegisterResponseData> {
        const user: User = await this.registerUseCase.execute(body);

        return {
            id: user.id,
            username: user.username,
            createdAt: user.createdAt.toISOString(),
        };
    }
}
