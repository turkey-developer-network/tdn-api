import { request } from "../setup";
import { describe, expect, it } from "vitest";

const FRONTEND_URL = "http://localhost:5173";

/**
 * E2E tests for OAuth redirect endpoints.
 * Validates that GitHub and Google authorization endpoints redirect correctly,
 * and that callback endpoints handle error/missing-code scenarios with proper redirects.
 *
 * Note: Full OAuth callback flows (valid authorization codes) require real external
 * provider APIs and are therefore out of scope for e2e tests.
 */
describe("OAuth Redirect Endpoints", () => {
    describe("GET /oauth/github - GitHub Authorization Redirect", () => {
        it("should redirect to GitHub authorization URL", async () => {
            const response = await request({
                method: "GET",
                url: "/oauth/github",
            });

            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toMatch(
                /^https:\/\/github\.com\/login\/oauth\/authorize/,
            );
        });
    });

    describe("GET /oauth/github/callback - GitHub Callback", () => {
        it("should redirect to frontend login page when provider returns an error", async () => {
            const response = await request({
                method: "GET",
                url: "/oauth/github/callback?error=access_denied",
            });

            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toBe(
                `${FRONTEND_URL}/login?error=github_access_denied`,
            );
        });

        it("should redirect to frontend login page when authorization code is missing", async () => {
            const response = await request({
                method: "GET",
                url: "/oauth/github/callback",
            });

            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toBe(
                `${FRONTEND_URL}/login?error=missing_code`,
            );
        });
    });

    describe("GET /oauth/google - Google Authorization Redirect", () => {
        it("should redirect to Google authorization URL", async () => {
            const response = await request({
                method: "GET",
                url: "/oauth/google",
            });

            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toMatch(
                /^https:\/\/accounts\.google\.com\/o\/oauth2\/v2\/auth/,
            );
        });
    });

    describe("GET /oauth/google/callback - Google Callback", () => {
        it("should redirect to frontend login page when provider returns an error", async () => {
            const response = await request({
                method: "GET",
                url: "/oauth/google/callback?error=access_denied",
            });

            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toBe(
                `${FRONTEND_URL}/login?error=google_access_denied`,
            );
        });

        it("should redirect to frontend login page when authorization code is missing", async () => {
            const response = await request({
                method: "GET",
                url: "/oauth/google/callback",
            });

            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toBe(
                `${FRONTEND_URL}/login?error=missing_code`,
            );
        });
    });
});
