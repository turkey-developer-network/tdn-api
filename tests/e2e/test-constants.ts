/**
 * Shared test constants for E2E tests.
 *
 * BOT_USER is seeded into the test database during global-setup.
 * The `plainToken` is used in `Authorization: Bot <token>` headers.
 */
export const BOT_USER = {
    email: "e2e-bot@test.com",
    password: "BotPassword123!",
    username: "e2ebot",
    fullName: "E2E Bot",
    plainToken: "tdn_bot_e2e_testtoken_fixed_1234567890abcdef",
} as const;
