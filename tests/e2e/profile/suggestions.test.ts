import { parseBody, request } from "../setup";
import { beforeAll, describe, expect, it } from "vitest";

/**
 * E2E tests for the GET /profiles/suggestions endpoint.
 * Validates that suggested users are returned with correct shape,
 * limit parameter works, and the endpoint is public.
 */
describe("GET /profiles/suggestions - Get Suggested Users", () => {
    /**
     * Registers two users to ensure there are suggestions available.
     */
    beforeAll(async () => {
        const ts = Date.now();
        await Promise.all([
            request({
                method: "POST",
                url: "/auth/register",
                payload: {
                    email: `sug1-${ts}@test.com`,
                    password: "password123",
                    username: `sug1${ts}`,
                },
            }),
            request({
                method: "POST",
                url: "/auth/register",
                payload: {
                    email: `sug2-${ts}@test.com`,
                    password: "password123",
                    username: `sug2${ts}`,
                },
            }),
        ]);
    });

    it("should return 200 with an array of suggested users", async () => {
        const response = await request({
            method: "GET",
            url: "/profiles/suggestions",
        });
        const body = parseBody<{
            data: {
                userId: string;
                username: string;
                avatarUrl: string;
                bannerUrl: string;
                followersCount: number;
                isFollowing: boolean;
                isMe: boolean;
            }[];
            meta: { timestamp: string };
        }>(response);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(body.data)).toBe(true);
        body.data.forEach((item) => {
            expect(item).toHaveProperty("userId");
            expect(item).toHaveProperty("username");
            expect(item).toHaveProperty("avatarUrl");
            expect(item).toHaveProperty("bannerUrl");
            expect(item).toHaveProperty("followersCount");
            expect(item.isFollowing).toBe(false);
            expect(item.isMe).toBe(false);
        });
        expect(body.meta).toHaveProperty("timestamp", expect.any(String));
    });

    it("should return at most limit items when limit is specified", async () => {
        const response = await request({
            method: "GET",
            url: "/profiles/suggestions?limit=2",
        });
        const body = parseBody<{ data: unknown[] }>(response);

        expect(response.statusCode).toBe(200);
        expect(body.data.length).toBeLessThanOrEqual(2);
    });

    it("should return 200 without authentication (public endpoint)", async () => {
        const response = await request({
            method: "GET",
            url: "/profiles/suggestions",
        });

        expect(response.statusCode).toBe(200);
    });
});
