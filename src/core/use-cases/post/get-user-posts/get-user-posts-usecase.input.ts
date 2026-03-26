export interface GetUserPostsInput {
    username: string;
    page: number;
    limit: number;
    type?: string;
}
