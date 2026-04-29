import { authRequest, parseBody, request } from "../setup";
import { beforeAll, describe, expect, it } from "vitest";

/**
 * E2E tests for the PATCH /profiles/me endpoint.
 * Validates that an authenticated user can update their profile fields,
 * the side-effect is visible on GET, and auth guard works.
 */
describe("PATCH /profiles/me - Update Profile", () => {
    const ts = Date.now();
    const user = {
        email: `pup-${ts}@test.com`,
        password: "password123",
        username: `pup${ts}`,
    };

    let accessToken = "";

    /**
     * Registers a test user and logs in to obtain an access token.
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
    });

    it("should return 204 when updating profile fields", async () => {
        const response = await authRequest(accessToken, {
            method: "PATCH",
            url: "/profiles/me",
            payload: {
                fullName: "E2E Test User",
                bio: "This is an e2e test bio",
                location: "Test City",
            },
        });

        expect(response.statusCode).toBe(204);
    });

    it("should reflect updated fields when fetching own profile", async () => {
        const response = await authRequest(accessToken, {
            method: "GET",
            url: `/profiles/${user.username}`,
        });
        const body = parseBody<{
            data: { fullName: string; bio: string; location: string };
        }>(response);

        expect(response.statusCode).toBe(200);
        expect(body.data.fullName).toBe("E2E Test User");
        expect(body.data.bio).toBe("This is an e2e test bio");
        expect(body.data.location).toBe("Test City");
    });

    it("should return 204 when clearing nullable fields with null", async () => {
        const response = await authRequest(accessToken, {
            method: "PATCH",
            url: "/profiles/me",
            payload: {
                bio: null,
                location: null,
            },
        });

        expect(response.statusCode).toBe(204);
    });

    it("should return 401 when not authenticated", async () => {
        const response = await request({
            method: "PATCH",
            url: "/profiles/me",
            payload: { fullName: "Unauthorized" },
        });
        const body = parseBody<{ title: string }>(response);

        expect(response.statusCode).toBe(401);
        expect(body.title).toBe("UnauthorizedError");
    });
});
