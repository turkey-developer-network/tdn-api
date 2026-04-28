import { authRequest, parseBody, request } from "../setup";
import { beforeAll, describe, expect, it } from "vitest";

/**
 * E2E tests for the GET /notifications endpoint.
 * Validates that an authenticated user can retrieve their notifications
 * with proper pagination metadata, and that proper errors are returned
 * for unauthenticated requests.
 */
describe("GET /notifications - Get User Notifications", () => {
    const ts = Date.now();
    const userA = {
        email: `ntf-a-${ts}@test.com`,
        password: "password123",
        username: `ntfa${ts}`,
    };
    const userB = {
        email: `ntf-b-${ts}@test.com`,
        password: "password123",
        username: `ntfb${ts}`,
    };

    let tokenA = "";
    let userAId = "";
    let tokenB = "";

    /**
     * Registers two users, logs in as both, then has B follow A
     * so that A has at least one FOLLOW notification to retrieve.
     */
    beforeAll(async () => {
        const registerA = await request({
            method: "POST",
            url: "/auth/register",
            payload: userA,
        });
        userAId = parseBody<{ data: { id: string } }>(registerA).data.id;

        const loginA = await request({
            method: "POST",
            url: "/auth/login",
            payload: { identifier: userA.email, password: userA.password },
        });
        tokenA = parseBody<{ data: { accessToken: string } }>(loginA).data
            .accessToken;

        await request({
            method: "POST",
            url: "/auth/register",
            payload: userB,
        });

        const loginB = await request({
            method: "POST",
            url: "/auth/login",
            payload: { identifier: userB.email, password: userB.password },
        });
        tokenB = parseBody<{ data: { accessToken: string } }>(loginB).data
            .accessToken;

        // Seed: B follows A → creates a FOLLOW notification for A
        await authRequest(tokenB, {
            method: "POST",
            url: "/follows",
            payload: { targetId: userAId },
        });
    });

    it("should return 200 with notification list and pagination meta", async () => {
        const response = await authRequest(tokenA, {
            method: "GET",
            url: "/notifications",
        });
        const body = parseBody<{
            data: {
                recipientId: string;
                issuerId: string;
                type: string;
                isRead: boolean;
                createdAt: string;
            }[];
            meta: {
                total: number;
                currentPage: number;
                totalPages: number;
                limit: number;
            };
        }>(response);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(body.data)).toBe(true);
        expect(body.data.length).toBeGreaterThanOrEqual(1);
        expect(body.data[0]).toMatchObject({
            recipientId: userAId,
            type: "FOLLOW",
            isRead: false,
        });
        expect(body.meta).toMatchObject({
            total: expect.any(Number),
            currentPage: 1,
            totalPages: expect.any(Number),
            limit: 10,
        });
    });

    it("should return 200 with correct pagination when limit=1", async () => {
        const response = await authRequest(tokenA, {
            method: "GET",
            url: "/notifications?page=1&limit=1",
        });
        const body = parseBody<{
            data: unknown[];
            meta: { currentPage: number; limit: number };
        }>(response);

        expect(response.statusCode).toBe(200);
        expect(body.data.length).toBeLessThanOrEqual(1);
        expect(body.meta.currentPage).toBe(1);
        expect(body.meta.limit).toBe(1);
    });

    it("should return 200 with empty list when user has no notifications", async () => {
        // Register a fresh user with no notifications
        const freshTs = Date.now();
        const freshUser = {
            email: `ntf-fresh-${freshTs}@test.com`,
            password: "password123",
            username: `ntffresh${freshTs}`,
        };

        await request({
            method: "POST",
            url: "/auth/register",
            payload: freshUser,
        });

        const loginRes = await request({
            method: "POST",
            url: "/auth/login",
            payload: {
                identifier: freshUser.email,
                password: freshUser.password,
            },
        });
        const freshToken = parseBody<{ data: { accessToken: string } }>(
            loginRes,
        ).data.accessToken;

        const response = await authRequest(freshToken, {
            method: "GET",
            url: "/notifications",
        });
        const body = parseBody<{
            data: unknown[];
            meta: { total: number };
        }>(response);

        expect(response.statusCode).toBe(200);
        expect(body.data).toEqual([]);
        expect(body.meta.total).toBe(0);
    });

    it("should return 401 when not authenticated", async () => {
        const response = await request({
            method: "GET",
            url: "/notifications",
        });
        const body = parseBody<{ title: string }>(response);

        expect(response.statusCode).toBe(401);
        expect(body.title).toBe("UnauthorizedError");
    });
});
