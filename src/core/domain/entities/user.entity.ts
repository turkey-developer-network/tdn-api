export interface UserProps {
    id: string;
    email: string;
    username: string;
    passwordHash: string | null;
    isEmailVerified: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export class User {
    constructor(private readonly props: UserProps) {}

    get id(): string {
        return this.props.id;
    }

    get email(): string {
        return this.props.email;
    }

    get username(): string {
        return this.props.username;
    }

    get passwordHash(): string | null {
        return this.props.passwordHash;
    }

    get deletedAt(): Date | null {
        return this.props.deletedAt;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    public isDeleted(): boolean {
        return this.props.deletedAt !== null;
    }

    public hasPassword(): boolean {
        return this.props.passwordHash !== null;
    }

    public set hashPassword(newPasswordHash: string) {
        this.props.passwordHash = newPasswordHash;
    }

    public delete(): void {
        this.props.deletedAt = new Date();
        this.props.updatedAt = new Date();
    }

    get isEmailVerified(): boolean {
        return this.props.isEmailVerified;
    }
    public restore(): void {
        this.props.deletedAt = null;
        this.props.updatedAt = new Date();
    }

    verifyEmail(): void {
        this.props.isEmailVerified = true;
    }
}
