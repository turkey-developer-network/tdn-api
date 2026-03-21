export enum PostType {
    COMMUNITY = "COMMUNITY",
    TECH_NEWS = "TECH_NEWS",
    SYSTEM_UPDATE = "SYSTEM_UPDATE",
    JOB_POSTING = "JOB_POSTING",
}

export interface CreatePostInput {
    content: string;
    type: PostType;
    mediaUrls?: string[];
    authorId: string;
}

export interface IPostRepository {
    create(data: CreatePostInput): Promise<void>;
}
