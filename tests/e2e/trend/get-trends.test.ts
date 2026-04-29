import { authRequest, parseBody, request } from "../setup";
import { beforeAll, describe, expect, it } from "vitest";

/**
 * E2E tests for GET /tags/trends.
 *
 * The endpoint is public (no auth required) and returns trending tags
 * within a fixed 7-day window. Tests cover shape validation, limit
 * query param, and the meta.windowDays field.
 */
describe("GET /tags/trends - Get Trends", () => {
    const ts = Date.now();

    const user = {
        email: `trends_${ts}@test.com`,
        password: "password123",
        username: `trends${ts}`.slice(0, 30),
    };

    let accessToken = "";

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

        // Create a post with a tag so trends has data to return
        await authRequest(accessToken, {
            method: "POST",
            url: "/posts",
            payload: { content: "e2e trends test #vitest", type: "COMMUNITY" },
        });
    });

    it("should return 200 with trends array and correct meta shape", async () => {
        const response = await request({
            method: "GET",
            url: "/tags/trends",
        });

        const body = parseBody<{
            data: {
                trends: {
                    tag: string;
                    postCount: number;
                    category: string | null;
                }[];
            };
            meta: { timestamp: string; windowDays: number };
        }>(response);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(body.data.trends)).toBe(true);
        expect(body.meta.windowDays).toBe(7);
        expect(typeof body.meta.timestamp).toBe("string");
    });

    it("should respect the limit query param", async () => {
        const response = await request({
            method: "GET",
            url: "/tags/trends?limit=1",
        });

        const body = parseBody<{
            data: { trends: unknown[] };
        }>(response);

        expect(response.statusCode).toBe(200);
        expect(body.data.trends.length).toBeLessThanOrEqual(1);
    });

    it("should return 200 without authentication (public endpoint)", async () => {
        const response = await request({
            method: "GET",
            url: "/tags/trends",
        });

        expect(response.statusCode).toBe(200);
    });

    it("should return 400 when limit exceeds maximum (50)", async () => {
        const response = await request({
            method: "GET",
            url: "/tags/trends?limit=51",
        });

        expect(response.statusCode).toBe(400);
    });

    it("should return 400 when limit is below minimum (1)", async () => {
        const response = await request({
            method: "GET",
            url: "/tags/trends?limit=0",
        });

        expect(response.statusCode).toBe(400);
    });
});
