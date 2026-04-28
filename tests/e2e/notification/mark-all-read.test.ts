import { authRequest, parseBody, request } from "../setup";
import { beforeAll, describe, expect, it } from "vitest";

/**
 * E2E tests for the PATCH /notifications/read-all endpoint.
 * Validates that an authenticated user can mark all their notifications as read,
 * that the operation is idempotent, and that proper errors are returned
 * for unauthenticated requests.
 */
describe("PATCH /notifications/read-all - Mark All Notifications As Read", () => {
    const ts = Date.now();
    const userA = {
        email: `ntfr-a-${ts}@test.com`,
        password: "password123",
        username: `ntfra${ts}`,
    };
    const userB = {
        email: `ntfr-b-${ts}@test.com`,
        password: "password123",
        username: `ntfrb${ts}`,
    };

    let tokenA = "";
    let userAId = "";
    let tokenB = "";

    /**
     * Registers two users, logs in as both, then has B follow A
     * so that A has at least one unread notification before the mark-read test.
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

        // Seed: B follows A → creates an unread FOLLOW notification for A
        await authRequest(tokenB, {
            method: "POST",
            url: "/follows",
            payload: { targetId: userAId },
        });
    });

    it("should return 200 with meta.timestamp when marking all notifications as read", async () => {
        const response = await authRequest(tokenA, {
            method: "PATCH",
            url: "/notifications/read-all",
        });
        const body = parseBody<{ meta: { timestamp: string } }>(response);

        expect(response.statusCode).toBe(200);
        expect(body.meta).toHaveProperty("timestamp", expect.any(String));
    });

    it("should return 200 when there are no unread notifications (idempotent)", async () => {
        const response = await authRequest(tokenA, {
            method: "PATCH",
            url: "/notifications/read-all",
        });
        const body = parseBody<{ meta: { timestamp: string } }>(response);

        expect(response.statusCode).toBe(200);
        expect(body.meta).toHaveProperty("timestamp", expect.any(String));
    });

    it("should mark notifications as read (verifies side effect)", async () => {
        const listRes = await authRequest(tokenA, {
            method: "GET",
            url: "/notifications",
        });
        const body = parseBody<{
            data: { isRead: boolean }[];
        }>(listRes);

        expect(listRes.statusCode).toBe(200);
        body.data.forEach((n) => {
            expect(n.isRead).toBe(true);
        });
    });

    it("should return 401 when not authenticated", async () => {
        const response = await request({
            method: "PATCH",
            url: "/notifications/read-all",
        });
        const body = parseBody<{ title: string }>(response);

        expect(response.statusCode).toBe(401);
        expect(body.title).toBe("UnauthorizedError");
    });
});
