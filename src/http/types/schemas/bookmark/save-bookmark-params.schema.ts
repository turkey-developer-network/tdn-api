/**
 * Schema for bookmark creation parameters
 */
import { Type } from "@sinclair/typebox";
import { type Static } from "@fastify/type-provider-typebox";
import { MetaOnlyResponseSchema } from "../create-response-schema";

/**
 * Schema for saving a bookmark
 * @description Validates the post ID parameter for bookmark creation
 */
export const saveBookmarkParamsSchema = Type.Object(
    {
        /** The ID of the post to bookmark (must be a valid UUID) */
        id: Type.String({
            format: "uuid",
        }),
    },
    { additionalProperties: false },
);

/**
 * Type for bookmark creation parameters
 */
export type SaveBookmarkParams = Static<typeof saveBookmarkParamsSchema>;

export const SaveBookmarkResponseSchema = MetaOnlyResponseSchema;
export type SaveBookmarkResponse = Static<typeof SaveBookmarkResponseSchema>;
