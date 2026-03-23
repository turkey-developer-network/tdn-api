import type { PostType } from "@core/domain/enums/post-type.enum";

export interface GetPostsInput {
    page?: number;
    limit?: number;
    type?: PostType;
}
