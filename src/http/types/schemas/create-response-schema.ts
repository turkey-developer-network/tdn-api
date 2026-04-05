import { type TSchema, Type } from "@fastify/type-provider-typebox";

export const MetaSchema = Type.Object({
    timestamp: Type.String({ format: "date-time" }),
});

export function ResponseSchema<T extends TSchema>(
    data: T,
): Type.TObject<{
    data: T;
    meta: Type.TObject<{
        timestamp: Type.TString;
    }>;
}> {
    return Type.Object({
        data,
        meta: MetaSchema,
    });
}

/**
 * Schema for action responses that return only meta (no data payload).
 * Used by: follow, unfollow, like, unlike, save, unsave, markAllRead
 */
export const MetaOnlyResponseSchema = Type.Object({
    meta: MetaSchema,
});
