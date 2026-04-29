import { authRequest, parseBody, request } from "../setup";
import { beforeAll, describe, expect, it } from "vitest";

/**
 * E2E tests for the POST /translate endpoint.
 *
 * Covers authentication guard, schema validation, successful translation
 * (via real DeepL API), Redis cache hit on repeated requests, and 502
 * propagation when DeepL rejects the language code.
 *
 * The suite is skipped automatically when DEEPL_API_KEY is absent or set
 * to the placeholder value ("deepl_api_key") — e.g. in CI environments
 * that do not provision the secret.
 */
const hasDeepLKey =
    !!process.env.DEEPL_API_KEY &&
    process.env.DEEPL_API_KEY !== "deepl_api_key";

describe.skipIf(!hasDeepLKey)("POST /translate - Translation", () => {
    const ts = Date.now();

    const user = {
        email: `trans_${ts}@test.com`,
        password: "password123",
        username: `trans${ts}`.slice(0, 30),
    };

    let accessToken = "";
    let firstTranslation = "";

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

    it("should return 200 with translatedText when authenticated", async () => {
        const response = await authRequest(accessToken, {
            method: "POST",
            url: "/translate",
            payload: { text: "Hello world", targetLang: "DE" },
        });

        const body = parseBody<{
            data: { translatedText: string };
            meta: { timestamp: string };
        }>(response);

        expect(response.statusCode).toBe(200);
        expect(typeof body.data.translatedText).toBe("string");
        expect(body.data.translatedText.length).toBeGreaterThan(0);
        expect(typeof body.meta.timestamp).toBe("string");

        firstTranslation = body.data.translatedText;
    });

    it("should return 200 with same result on repeated request (cache hit)", async () => {
        const response = await authRequest(accessToken, {
            method: "POST",
            url: "/translate",
            payload: { text: "Hello world", targetLang: "DE" },
        });

        const body = parseBody<{ data: { translatedText: string } }>(response);

        expect(response.statusCode).toBe(200);
        expect(body.data.translatedText).toBe(firstTranslation);
    });

    it("should return 502 when the language code is not supported by DeepL", async () => {
        const response = await authRequest(accessToken, {
            method: "POST",
            url: "/translate",
            payload: { text: "Hello world", targetLang: "ZZ" },
        });

        const body = parseBody<{ title: string; status: number }>(response);

        expect(response.statusCode).toBe(502);
        expect(body.title).toBe("TranslationFailedError");
    });

    it("should return 400 when text is missing", async () => {
        const response = await authRequest(accessToken, {
            method: "POST",
            url: "/translate",
            payload: { targetLang: "DE" },
        });

        expect(response.statusCode).toBe(400);
    });

    it("should return 400 when text is an empty string", async () => {
        const response = await authRequest(accessToken, {
            method: "POST",
            url: "/translate",
            payload: { text: "", targetLang: "DE" },
        });

        expect(response.statusCode).toBe(400);
    });

    it("should return 400 when targetLang is shorter than 2 characters", async () => {
        const response = await authRequest(accessToken, {
            method: "POST",
            url: "/translate",
            payload: { text: "Hello world", targetLang: "X" },
        });

        expect(response.statusCode).toBe(400);
    });

    it("should return 401 when not authenticated", async () => {
        const response = await request({
            method: "POST",
            url: "/translate",
            payload: { text: "Hello world", targetLang: "DE" },
        });

        const body = parseBody<{ title: string }>(response);

        expect(response.statusCode).toBe(401);
        expect(body.title).toBe("UnauthorizedError");
    });
});
