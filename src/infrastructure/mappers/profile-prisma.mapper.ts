import { Profile, type ProfileProps } from "@core/entities/profile.entitiy";
import type {
    Prisma,
    Profile as PrismaProfile,
} from "@generated/prisma/client";

/**
 * Mapper class responsible for transforming Profile data across different layers.
 * Handles conversions between Prisma database records, Domain entities, and safe Response objects.
 */
export default class ProfilePrismaMapper {
    /**
     * Maps a Prisma database record to a core Domain entity.
     * * @param dbProfile - The profile record retrieved from the Prisma database.
     * @returns The instantiated Profile domain entity.
     */
    static toDomain(dbProfile: PrismaProfile): Profile {
        return new Profile({
            id: dbProfile.id,
            userId: dbProfile.userId,
            fullName: dbProfile.fullName,
            bio: dbProfile.bio,
            location: dbProfile.location,
            avatarUrl: dbProfile.avatarUrl,
            bannerUrl: dbProfile.bannerUrl,
            socials: dbProfile.socials as Record<string, string>,
            createdAt: dbProfile.createdAt,
            updatedAt: dbProfile.updatedAt,
        });
    }

    /**
     * Maps Domain entity state to a Prisma-compatible update object.
     * * @param profile - The Profile domain entity.
     * @returns The Prisma-formatted data object for updates.
     */
    static toPrismaUpdate(profile: Profile): Prisma.ProfileUpdateInput {
        return {
            fullName: profile.fullName,
            bio: profile.bio,
            location: profile.location,
            avatarUrl: profile.avatarUrl,
            bannerUrl: profile.bannerUrl,
            socials: profile.socials as Prisma.InputJsonValue,
            updatedAt: new Date(),
        };
    }

    /**
     * Maps a Domain entity to a safe public response object.
     * * @param profile - The Profile domain entity.
     * @returns A sanitized profile object safe for external API responses.
     */
    static toResponse(profile: Profile): Omit<ProfileProps, "id" | "userId"> {
        return {
            fullName: profile.fullName,
            bio: profile.bio,
            location: profile.location,
            avatarUrl: profile.avatarUrl,
            bannerUrl: profile.bannerUrl,
            socials: profile.socials,
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt,
        };
    }
}
