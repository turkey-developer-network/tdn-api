import { authRequest, parseBody, request } from "../setup";
import { beforeAll, describe, expect, it } from "vitest";

/**
 * E2E tests for GET /tags/search?q=.
 *
 * The endpoint is public. Tests cover matching results, limit param,
 * empty results, and schema validation.
 */
describe("GET /tags/search - Search Tags", () => {
    const ts = Date.now();

    const user = {
        email: `tagsearch_${ts}@test.com`,
        password: "password123",
        username: `tagsrch${ts}`.slice(0, 30),
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

        // Seed a post with a known tag so search has something to find
        await authRequest(accessToken, {
            method: "POST",
            url: "/posts",
            payload: {
                content: "e2e tag search #e2etagunique",
                type: "COMMUNITY",
            },
        });
    });

    it("should return 200 with matching tags and correct shape", async () => {
        const response = await request({
            method: "GET",
            url: "/tags/search?q=e2etagunique",
        });

        const body = parseBody<{
            data: {
                name: string;
                postCount: number;
                category: string | null;
            }[];
            meta: { timestamp: string; count: number };
        }>(response);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(body.data)).toBe(true);
        expect(body.data.length).toBeGreaterThan(0);
        expect(body.data[0]).toMatchObject({
            name: expect.any(String),
            postCount: expect.any(Number),
        });
        expect(body.meta.count).toBe(body.data.length);
        expect(typeof body.meta.timestamp).toBe("string");
    });

    it("should return 200 with limited results when limit=1", async () => {
        const response = await request({
            method: "GET",
            url: "/tags/search?q=e2etagunique&limit=1",
        });

        const body = parseBody<{ data: unknown[] }>(response);

        expect(response.statusCode).toBe(200);
        expect(body.data.length).toBeLessThanOrEqual(1);
    });

    it("should return 200 with empty array when query matches nothing", async () => {
        const response = await request({
            method: "GET",
            url: "/tags/search?q=xyznonexistenttag999",
        });

        const body = parseBody<{ data: unknown[] }>(response);

        expect(response.statusCode).toBe(200);
        expect(body.data).toEqual([]);
    });

    it("should return 200 without authentication (public endpoint)", async () => {
        const response = await request({
            method: "GET",
            url: "/tags/search?q=test",
        });

        expect(response.statusCode).toBe(200);
    });

    it("should return 400 when q is missing", async () => {
        const response = await request({
            method: "GET",
            url: "/tags/search",
        });

        expect(response.statusCode).toBe(400);
    });

    it("should return 400 when q is an empty string", async () => {
        const response = await request({
            method: "GET",
            url: "/tags/search?q=",
        });

        expect(response.statusCode).toBe(400);
    });
});
