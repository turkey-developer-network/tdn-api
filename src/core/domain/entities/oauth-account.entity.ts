export interface OAuthAccountProps {
    id: string;
    userId: string;
    provider: string;
    providerAccountId: string;
    createdAt: Date;
    updatedAt: Date;
}

export class OAuthAccount {
    constructor(private readonly props: OAuthAccountProps) {}
}
