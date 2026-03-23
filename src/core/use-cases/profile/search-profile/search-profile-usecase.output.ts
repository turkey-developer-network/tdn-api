import type { Profile } from "@core/domain/entities/profile.entity";

export interface SearchProfileOutput {
    profile: Profile;
    isMe: boolean;
}
