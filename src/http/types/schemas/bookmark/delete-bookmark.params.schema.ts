/**
 * Schema for bookmark deletion parameters
 */
import { Type } from "@sinclair/typebox";
import { type Static } from "@fastify/type-provider-typebox";
import { MetaOnlyResponseSchema } from "../create-response-schema";

/**
 * Schema for deleting a bookmark
 * @description Validates the post ID parameter for bookmark removal
 */
export const deleteBookmarkParamsSchema = Type.Object(
    {
        /** The ID of the post to unbookmark (must be a valid UUID) */
        id: Type.String({
            format: "uuid",
        }),
    },
    { additionalProperties: false },
);

/**
 * Type for bookmark deletion parameters
 */
export type DeleteBookmarkParams = Static<typeof deleteBookmarkParamsSchema>;

export const UnsaveBookmarkResponseSchema = MetaOnlyResponseSchema;
export type UnsaveBookmarkResponse = Static<
    typeof UnsaveBookmarkResponseSchema
>;
