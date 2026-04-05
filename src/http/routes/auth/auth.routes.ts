/**
 * Authentication routes module
 *
 * This module defines all authentication-related API endpoints including:
 * - User registration and login
 * - Token refresh and logout
 * - Email verification
 * - Password reset functionality
 * - Account recovery
 *
 * @author TDN Team
 * @version 1.0.0
 */

import { RateLimitPolicies } from "@plugins/rate-limit.plugin";
import {
    type CheckUserBody,
    checkUserBodySchema,
    CheckUserResponseSchema,
    type CheckUserResponse,
} from "@typings/schemas/auth/check-user.schema";
import {
    ForgotPasswordBodySchema,
    type ForgotPasswordBody,
} from "@typings/schemas/auth/forgot-password.schema";
import {
    LoginBodySchema,
    LoginResponseSchema,
    type LoginBody,
    type LoginResponse,
} from "@typings/schemas/auth/login.schema";
import {
    RefreshResponseSchema,
    type RefreshResponse,
} from "@typings/schemas/auth/refresh.schema";
import {
    RecoverAccountSchema,
    RecoverAccountResponseSchema,
    type RecoverAccountBody,
    type RecoverAccountResponse,
} from "@typings/schemas/auth/recover-account.schema";
import {
    RegisterBodySchema,
    RegisterResponseSchema,
    type RegisterBody,
    type RegisterResponse,
} from "@typings/schemas/auth/register.schema";
import {
    ResetPasswordBodySchema,
    ResetPasswordResponseSchema,
    type ResetPasswordBody,
    type ResetPasswordResponse,
} from "@typings/schemas/auth/reset-password.schema";
import {
    SendVerificationResponseSchema,
    type SendVerificationResponse,
} from "@typings/schemas/auth/send-verification.schema";
import {
    VerifyEmailBodySchema,
    VerifyEmailResponseSchema,
    type VerifyEmailBody,
    type VerifyEmailResponse,
} from "@typings/schemas/auth/verify-email.schema";
import type { FastifyInstance } from "fastify";

/**
 * Sets up authentication routes on the Fastify instance
 *
 * @param fastify - The Fastify application instance
 * @returns void
 */
export function authRoutes(fastify: FastifyInstance): void {
    const authController = fastify.diContainer.cradle.authController;

    fastify.post<{ Body: RegisterBody; Reply: { 201: RegisterResponse } }>(
        "/register",
        {
            config: { rateLimit: RateLimitPolicies.STRICT },
            schema: {
                body: RegisterBodySchema,
                response: { 201: RegisterResponseSchema },
                tags: ["Auth"],
            },
        },
        authController.register.bind(authController),
    );

    fastify.post<{ Body: LoginBody; Reply: { 200: LoginResponse } }>(
        "/login",
        {
            config: { rateLimit: RateLimitPolicies.STRICT },
            schema: {
                body: LoginBodySchema,
                response: { 200: LoginResponseSchema },
                tags: ["Auth"],
            },
        },
        authController.login.bind(authController),
    );

    fastify.post<{ Reply: { 200: RefreshResponse } }>(
        "/refresh",
        {
            config: { rateLimit: RateLimitPolicies.SENSITIVE },
            schema: {
                response: { 200: RefreshResponseSchema },
                tags: ["Auth"],
            },
        },
        authController.refresh.bind(authController),
    );

    fastify.post<{ Reply: { 204: void } }>(
        "/logout",
        {
            config: { rateLimit: RateLimitPolicies.STANDARD },
            schema: {
                tags: ["Auth"],
            },
        },
        authController.logout.bind(authController),
    );

    fastify.post<{ Reply: { 200: SendVerificationResponse } }>(
        "/send-verification",
        {
            onRequest: [fastify.authenticate],
            config: { rateLimit: RateLimitPolicies.STRICT },
            schema: {
                response: { 200: SendVerificationResponseSchema },
                tags: ["Auth"],
            },
        },
        authController.sendVerification.bind(authController),
    );

    fastify.post<{
        Body: VerifyEmailBody;
        Reply: { 200: VerifyEmailResponse };
    }>(
        "/verify-email",
        {
            onRequest: [fastify.authenticate],
            config: { rateLimit: RateLimitPolicies.STRICT },
            schema: {
                body: VerifyEmailBodySchema,
                response: { 200: VerifyEmailResponseSchema },
                tags: ["Auth"],
            },
        },

        authController.verifyEmail.bind(authController),
    );

    fastify.post<{ Body: ForgotPasswordBody; Reply: { 204: void } }>(
        "/forgot-password",
        {
            config: { rateLimit: RateLimitPolicies.STRICT },
            schema: {
                body: ForgotPasswordBodySchema,
                tags: ["Auth"],
            },
        },
        authController.forgotPassword.bind(authController),
    );

    fastify.post<{
        Body: ResetPasswordBody;
        Reply: { 200: ResetPasswordResponse };
    }>(
        "/reset-password",
        {
            config: { rateLimit: RateLimitPolicies.STRICT },
            schema: {
                body: ResetPasswordBodySchema,
                response: { 200: ResetPasswordResponseSchema },
                tags: ["Auth"],
            },
        },
        authController.resetPassword.bind(authController),
    );

    fastify.post<{
        Body: RecoverAccountBody;
        Reply: { 200: RecoverAccountResponse };
    }>(
        "/recover-account",
        {
            config: { rateLimit: RateLimitPolicies.STRICT },
            schema: {
                body: RecoverAccountSchema,
                response: { 200: RecoverAccountResponseSchema },
                tags: ["Auth"],
            },
        },
        authController.recoverAccount.bind(authController),
    );

    fastify.post<{ Body: CheckUserBody; Reply: { 200: CheckUserResponse } }>(
        "/check",
        {
            schema: {
                body: checkUserBodySchema,
                response: { 200: CheckUserResponseSchema },
                tags: ["Auth"],
            },
            config: { rateLimit: RateLimitPolicies.STANDARD },
        },
        authController.checkUser.bind(authController),
    );
}

export default authRoutes;
