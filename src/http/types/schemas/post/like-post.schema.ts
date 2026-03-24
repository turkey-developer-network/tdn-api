import { Type, type Static } from "@sinclair/typebox";

/**
 * Schema for like post request parameters
 * Validates that the post ID is a valid UUID format
 */
export const LikePostParamsSchema = Type.Object({
    id: Type.String({ format: "uuid" }),
});

/**
 * TypeScript type for like post request parameters
 * Represents the validated structure of the request parameters
 */
export type LikePostParams = Static<typeof LikePostParamsSchema>;
