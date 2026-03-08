import type { User } from "@core/entities/user.entity";
import type {
    LoginInput,
    LoginOutput,
    LoginUseCase,
} from "@core/use-cases/login.usecase";
import type {
    RefreshInput,
    RefreshOutput,
    RefreshUseCase,
} from "@core/use-cases/refresh.usecase";
import type {
    RegisterInput,
    RegisterUseCase,
} from "@core/use-cases/register.usecase";

export class AuthService {
    constructor(
        private readonly registerUseCase: RegisterUseCase,
        private readonly loginUseCase: LoginUseCase,
        private readonly refreshUseCase: RefreshUseCase,
    ) {}

    async register(input: RegisterInput): Promise<User> {
        const user: User = await this.registerUseCase.execute(input);
        return user;
    }

    async login(input: LoginInput): Promise<LoginOutput> {
        const result = await this.loginUseCase.execute(input);
        return result;
    }

    async refresh(input: RefreshInput): Promise<RefreshOutput> {
        return await this.refreshUseCase.execute(input);
    }
}
