export interface ProfileProps {
    id: string;
    userId: string;
    fullName: string;
    bio: string | null;
    location: string | null;
    avatarUrl: string;
    bannerUrl: string;
    socials: Record<string, string> | null;
    createdAt: Date;
    updatedAt: Date;
}

export class Profile {
    constructor(private readonly props: ProfileProps) {}

    get id(): string {
        return this.props.id;
    }

    get userId(): string {
        return this.props.userId;
    }

    get fullName(): string {
        return this.props.fullName;
    }

    get bio(): string | null {
        return this.props.bio;
    }

    get location(): string | null {
        return this.props.location;
    }

    get avatarUrl(): string {
        return this.props.avatarUrl;
    }

    get bannerUrl(): string {
        return this.props.bannerUrl;
    }

    get socials(): Record<string, string> {
        return this.props.socials || {};
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    public update(
        data: Partial<
            Pick<ProfileProps, "fullName" | "bio" | "location" | "socials">
        >,
    ): void {
        Object.assign(this.props, {
            ...data,
            updatedAt: new Date(),
        });
    }
}
