import { authRequest, parseBody, request } from "../setup";
import { beforeAll, describe, expect, it } from "vitest";

/**
 * E2E tests for GET /users/me.
 *
 * Returns the authenticated user's account data including email,
 * verification status, timestamps, and linked OAuth providers.
 * The endpoint requires authentication.
 */
describe("GET /users/me - Get Me", () => {
    const ts = Date.now();

    const user = {
        email: `getme_${ts}@test.com`,
        password: "password123",
        username: `getme${ts}`.slice(0, 30),
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
    });

    it("should return 200 with correct shape when authenticated", async () => {
        const response = await authRequest(accessToken, {
            method: "GET",
            url: "/users/me",
        });

        const body = parseBody<{
            data: {
                username: string;
                email: string;
                isEmailVerified: boolean;
                createdAt: string;
                updatedAt: string;
                providers: string[];
            };
            meta: { timestamp: string };
        }>(response);

        expect(response.statusCode).toBe(200);
        expect(typeof body.data.username).toBe("string");
        expect(typeof body.data.email).toBe("string");
        expect(typeof body.data.isEmailVerified).toBe("boolean");
        expect(typeof body.data.createdAt).toBe("string");
        expect(typeof body.data.updatedAt).toBe("string");
        expect(Array.isArray(body.data.providers)).toBe(true);
        expect(typeof body.meta.timestamp).toBe("string");
    });

    it("should return email matching the registered email", async () => {
        const response = await authRequest(accessToken, {
            method: "GET",
            url: "/users/me",
        });

        const body = parseBody<{ data: { email: string } }>(response);

        expect(response.statusCode).toBe(200);
        expect(body.data.email).toBe(user.email);
    });

    it("should return empty providers array for password-registered user", async () => {
        const response = await authRequest(accessToken, {
            method: "GET",
            url: "/users/me",
        });

        const body = parseBody<{ data: { providers: string[] } }>(response);

        expect(response.statusCode).toBe(200);
        expect(body.data.providers).toEqual([]);
    });

    it("should return 401 when not authenticated", async () => {
        const response = await request({
            method: "GET",
            url: "/users/me",
        });

        const body = parseBody<{ title: string }>(response);

        expect(response.statusCode).toBe(401);
        expect(body.title).toBe("UnauthorizedError");
    });
});
