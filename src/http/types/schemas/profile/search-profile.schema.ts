import { Type } from "@sinclair/typebox";
import { Type as FBType, type Static } from "@fastify/type-provider-typebox";
import { ProfileItemSchema } from "./get-profile.schema";

export const SearchProfilesQuerySchema = Type.Object({
    q: Type.String({
        minLength: 2,
        maxLength: 50,
        description: "Search term for username or full name",
    }),
    limit: Type.Optional(Type.Number({ minimum: 1, maximum: 50, default: 10 })),
});

export type SearchProfilesQuery = Static<typeof SearchProfilesQuerySchema>;

export const SearchProfilesResponseSchema = FBType.Object({
    data: FBType.Array(ProfileItemSchema),
    meta: FBType.Object({
        timestamp: FBType.String({ format: "date-time" }),
        count: FBType.Number(),
    }),
});
export type SearchProfilesResponse = Static<
    typeof SearchProfilesResponseSchema
>;
