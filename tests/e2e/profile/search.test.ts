import { authRequest, parseBody, request } from "../setup";
import { beforeAll, describe, expect, it } from "vitest";

/**
 * E2E tests for the GET /profiles/search endpoint.
 * Validates profile search by query string, empty results for short queries,
 * and limit parameter behavior.
 */
describe("GET /profiles/search - Search Profiles", () => {
    const ts = Date.now();
    const user = {
        email: `psr-${ts}@test.com`,
        password: "password123",
        username: `psrtest${ts}`,
    };

    /**
     * Registers a searchable test user.
     */
    beforeAll(async () => {
        await request({
            method: "POST",
            url: "/auth/register",
            payload: user,
        });
    });

    it("should return 200 with matching profiles for a valid query", async () => {
        const response = await request({
            method: "GET",
            url: `/profiles/search?q=${user.username.slice(0, 6)}`,
        });
        const body = parseBody<{
            data: { username: string; isMe: boolean; isFollowing: boolean }[];
            meta: { timestamp: string; count: number };
        }>(response);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(body.data)).toBe(true);
        expect(body.data.some((p) => p.username === user.username)).toBe(true);
        body.data.forEach((p) => {
            expect(p).toHaveProperty("username");
            expect(p).toHaveProperty("avatarUrl");
            expect(p.isFollowing).toBe(false);
        });
        expect(body.meta.count).toEqual(expect.any(Number));
        expect(body.meta).toHaveProperty("timestamp", expect.any(String));
    });

    it("should return 200 with limited results when limit=1", async () => {
        const response = await request({
            method: "GET",
            url: `/profiles/search?q=${user.username.slice(0, 4)}&limit=1`,
        });
        const body = parseBody<{ data: unknown[] }>(response);

        expect(response.statusCode).toBe(200);
        expect(body.data.length).toBeLessThanOrEqual(1);
    });

    it("should return 200 with empty array when query matches nothing", async () => {
        const response = await request({
            method: "GET",
            url: "/profiles/search?q=zzznomatch9999xyz",
        });
        const body = parseBody<{ data: unknown[]; meta: { count: number } }>(
            response,
        );

        expect(response.statusCode).toBe(200);
        expect(body.data).toEqual([]);
        expect(body.meta.count).toBe(0);
    });

    it("should return 400 when query string is too short (less than 2 chars)", async () => {
        const response = await request({
            method: "GET",
            url: "/profiles/search?q=x",
        });

        expect(response.statusCode).toBe(400);
    });

    it("should work without authentication (public endpoint)", async () => {
        const response = await request({
            method: "GET",
            url: `/profiles/search?q=${user.username.slice(0, 4)}`,
        });

        expect(response.statusCode).toBe(200);
    });

    it("should return isMe: true for own profile when authenticated", async () => {
        const loginRes = await request({
            method: "POST",
            url: "/auth/login",
            payload: { identifier: user.email, password: user.password },
        });
        const token = parseBody<{ data: { accessToken: string } }>(loginRes)
            .data.accessToken;

        const response = await authRequest(token, {
            method: "GET",
            url: `/profiles/search?q=${user.username.slice(0, 6)}`,
        });
        const body = parseBody<{
            data: { username: string; isMe: boolean }[];
        }>(response);

        expect(response.statusCode).toBe(200);
        const own = body.data.find((p) => p.username === user.username);
        expect(own?.isMe).toBe(true);
    });
});
