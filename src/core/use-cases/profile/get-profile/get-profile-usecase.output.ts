import type { Profile } from "@core/domain/entities/profile.entity";

export interface GetProfileOutput {
    profile: Profile;
    isMe: boolean;
    isFollowing: boolean;
    postCount: number;
}
