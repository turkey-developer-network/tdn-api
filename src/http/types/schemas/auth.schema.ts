import { type Static, Type } from "@sinclair/typebox";
import { createResponseSchema } from "./create-response-schema";

/**
 * Expected HTTP request body schema for user registration.
 */
export const RegisterBodySchema = Type.Object({
    email: Type.String({ format: "email" }),
    username: Type.String({ minLength: 3, maxLength: 32 }),
    password: Type.String({ minLength: 8 }),
});

export type RegisterBody = Static<typeof RegisterBodySchema>;

/**
 * Internal DTO schema for a successful registration response.
 * Note: This payload will be wrapped by the global response formatter.
 */
export const RegisterResponseDataSchema = Type.Object({
    id: Type.String({ format: "uuid" }),
    username: Type.String(),
    createdAt: Type.String({ format: "date-time" }),
});

export type RegisterResponseData = Static<typeof RegisterResponseDataSchema>;

/**
 * Standard wrapped HTTP response schema for registration sent to the client.
 */
export const RegisterResponseSchema = createResponseSchema(
    RegisterResponseDataSchema,
);

export type RegisterResponse = Static<typeof RegisterResponseSchema>;

/**
 * Expected HTTP request body schema for user login.
 * The identifier can be either an email address or a username.
 */
export const LoginBodySchema = Type.Object({
    identifier: Type.String(),
    password: Type.String(),
});

export type LoginBody = Static<typeof LoginBodySchema>;

/**
 * Internal DTO schema for a successful login response.
 * Contains the access token, expiration timestamp, and basic user profile.
 */
export const LoginResponseDataSchema = Type.Object({
    accessToken: Type.String(),
    expiresAt: Type.Number(),
    user: Type.Object({
        id: Type.String({ format: "uuid" }),
        username: Type.String(),
    }),
});

export type LoginResponseData = Static<typeof LoginResponseDataSchema>;

/**
 * Standard wrapped HTTP response schema for login sent to the client.
 */
export const LoginResponseSchema = createResponseSchema(
    LoginResponseDataSchema,
);

export type LoginResponse = Static<typeof LoginResponseSchema>;
