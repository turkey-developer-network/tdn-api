import type { Profile } from "@core/entities/profile.entitiy";

export interface GetProfileOutput {
    profile: Profile;
    isMe: boolean;
    isFollowing: boolean;
}
