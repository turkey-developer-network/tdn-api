import { authRequest, parseBody, request } from "../setup";
import { beforeAll, describe, expect, it } from "vitest";

/**
 * E2E tests for GET /users/:username/posts.
 *
 * The endpoint supports optional authentication and returns paginated
 * posts for a given username. Tests cover response shape, PostItem fields,
 * pagination, public access, empty results, and query param validation.
 */
describe("GET /users/:username/posts - Get User Posts", () => {
    const ts = Date.now();

    const userA = {
        email: `usrpostsA_${ts}@test.com`,
        password: "password123",
        username: `usrpostsA${ts}`.slice(0, 30),
    };

    const userB = {
        email: `usrpostsB_${ts}@test.com`,
        password: "password123",
        username: `usrpostsB${ts}`.slice(0, 30),
    };

    let tokenA = "";

    beforeAll(async () => {
        await request({
            method: "POST",
            url: "/auth/register",
            payload: userA,
        });

        const loginA = await request({
            method: "POST",
            url: "/auth/login",
            payload: { identifier: userA.email, password: userA.password },
        });

        tokenA = parseBody<{ data: { accessToken: string } }>(loginA).data
            .accessToken;

        // Create 2 posts for userA so pagination and shape can be tested
        await authRequest(tokenA, {
            method: "POST",
            url: "/posts",
            payload: {
                content: "e2e user posts test 1 #e2euserpost",
                type: "COMMUNITY",
            },
        });

        await authRequest(tokenA, {
            method: "POST",
            url: "/posts",
            payload: { content: "e2e user posts test 2", type: "COMMUNITY" },
        });

        // Register userB with no posts for empty-result test
        await request({
            method: "POST",
            url: "/auth/register",
            payload: userB,
        });
    });

    it("should return 200 with correct response shape for userA", async () => {
        const response = await request({
            method: "GET",
            url: `/users/${userA.username}/posts`,
        });

        const body = parseBody<{
            data: unknown[];
            meta: {
                total: number;
                currentPage: number;
                limit: number;
                totalPages: number;
            };
        }>(response);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(body.data)).toBe(true);
        expect(typeof body.meta.total).toBe("number");
        expect(typeof body.meta.currentPage).toBe("number");
        expect(typeof body.meta.limit).toBe("number");
        expect(typeof body.meta.totalPages).toBe("number");
    });

    it("should return PostItem objects with all required fields", async () => {
        const response = await request({
            method: "GET",
            url: `/users/${userA.username}/posts`,
        });

        const body = parseBody<{
            data: {
                id: string;
                content: string;
                type: string;
                mediaUrls: string[];
                createdAt: string;
                likeCount: number;
                commentCount: number;
                isLiked: boolean;
                isBookmarked: boolean;
                author: {
                    id: string;
                    username: string;
                    avatarUrl: string;
                };
                tags: { name: string }[];
                categories: { name: string }[];
            }[];
        }>(response);

        expect(response.statusCode).toBe(200);
        expect(body.data.length).toBeGreaterThan(0);

        const post = body.data[0];
        expect(typeof post.id).toBe("string");
        expect(typeof post.content).toBe("string");
        expect(typeof post.type).toBe("string");
        expect(Array.isArray(post.mediaUrls)).toBe(true);
        expect(typeof post.createdAt).toBe("string");
        expect(typeof post.likeCount).toBe("number");
        expect(typeof post.commentCount).toBe("number");
        expect(typeof post.isLiked).toBe("boolean");
        expect(typeof post.isBookmarked).toBe("boolean");
        expect(typeof post.author.id).toBe("string");
        expect(Array.isArray(post.tags)).toBe(true);
        expect(Array.isArray(post.categories)).toBe(true);
    });

    it("should respect the limit query param and calculate totalPages correctly", async () => {
        const response = await request({
            method: "GET",
            url: `/users/${userA.username}/posts?limit=1`,
        });

        const body = parseBody<{
            data: unknown[];
            meta: { total: number; limit: number; totalPages: number };
        }>(response);

        expect(response.statusCode).toBe(200);
        expect(body.data.length).toBeLessThanOrEqual(1);
        expect(body.meta.limit).toBe(1);
        expect(body.meta.totalPages).toBe(
            Math.ceil(body.meta.total / body.meta.limit),
        );
    });

    it("should return 200 without authentication (public endpoint)", async () => {
        const response = await request({
            method: "GET",
            url: `/users/${userA.username}/posts`,
        });

        expect(response.statusCode).toBe(200);
    });

    it("should return 200 with empty data array when user has no posts", async () => {
        const response = await request({
            method: "GET",
            url: `/users/${userB.username}/posts`,
        });

        const body = parseBody<{
            data: unknown[];
            meta: { total: number };
        }>(response);

        expect(response.statusCode).toBe(200);
        expect(body.data).toEqual([]);
        expect(body.meta.total).toBe(0);
    });

    it("should return 400 when limit exceeds maximum (50)", async () => {
        const response = await request({
            method: "GET",
            url: `/users/${userA.username}/posts?limit=51`,
        });

        expect(response.statusCode).toBe(400);
    });

    it("should return 400 when limit is below minimum (1)", async () => {
        const response = await request({
            method: "GET",
            url: `/users/${userA.username}/posts?limit=0`,
        });

        expect(response.statusCode).toBe(400);
    });
});
