import { authRequest, parseBody, request } from "../setup";
import { beforeAll, describe, expect, it } from "vitest";

/**
 * E2E tests for the GET /posts endpoint.
 * Validates feed retrieval with pagination, filters,
 * optional auth, and auth guards.
 */
describe("GET /posts - Get Post Feed", () => {
    const ts = Date.now();
    const user = {
        email: `pgf-${ts}@test.com`,
        password: "password123",
        username: `pgf${ts}`,
    };

    let accessToken = "";

    /**
     * Registers a test user, logs in, and creates a post
     * so the feed has at least one item.
     */
    beforeAll(async () => {
        await request({
            method: "POST",
            url: "/auth/register",
            payload: user,
        });

        const loginRes = await request({
            method: "POST",
            url: "/auth/login",
            payload: { identifier: user.email, password: user.password },
        });

        accessToken = parseBody<{ data: { accessToken: string } }>(loginRes)
            .data.accessToken;

        await authRequest(accessToken, {
            method: "POST",
            url: "/posts",
            payload: { content: "E2E feed seed post" },
        });
    });

    it("should return 200 with posts array and pagination meta", async () => {
        const response = await authRequest(accessToken, {
            method: "GET",
            url: "/posts",
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
        expect(body.meta).toMatchObject({
            total: expect.any(Number),
            currentPage: 1,
            limit: 10,
            totalPages: expect.any(Number),
        });
    });

    it("should return 200 with at most 1 item when limit=1", async () => {
        const response = await authRequest(accessToken, {
            method: "GET",
            url: "/posts?page=1&limit=1",
        });
        const body = parseBody<{
            data: unknown[];
            meta: { limit: number; currentPage: number };
        }>(response);

        expect(response.statusCode).toBe(200);
        expect(body.data.length).toBeLessThanOrEqual(1);
        expect(body.meta.limit).toBe(1);
        expect(body.meta.currentPage).toBe(1);
    });

    it("should return 200 with only COMMUNITY posts when type=COMMUNITY", async () => {
        const response = await authRequest(accessToken, {
            method: "GET",
            url: "/posts?type=COMMUNITY",
        });
        const body = parseBody<{ data: { type: string }[] }>(response);

        expect(response.statusCode).toBe(200);
        body.data.forEach((post) => {
            expect(post.type).toBe("COMMUNITY");
        });
    });

    it("should return 200 for unauthenticated requests (public feed)", async () => {
        const response = await request({
            method: "GET",
            url: "/posts",
        });

        expect(response.statusCode).toBe(200);
    });

    it("should return 401 when followedOnly=true without authentication", async () => {
        const response = await request({
            method: "GET",
            url: "/posts?followedOnly=true",
        });
        const body = parseBody<{ title: string }>(response);

        expect(response.statusCode).toBe(401);
        expect(body.title).toBe("UnauthorizedError");
    });
});
