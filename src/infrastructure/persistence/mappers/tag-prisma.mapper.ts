import type { PostType } from "@core/domain/enums/post-type.enum";

const POST_TYPE_CATEGORY_MAP: Record<string, string> = {
    TECH_NEWS: "Technology",
    COMMUNITY: "Community",
    JOB_POSTING: "Jobs",
    SYSTEM_UPDATE: "System",
};

export class TagPrismaMapper {
    static mapPostTypeToCategory(type: PostType | string): string {
        if (!type) return "Community";
        const key = String(type).toUpperCase();
        return POST_TYPE_CATEGORY_MAP[key] ?? "Community";
    }
}
