import { Type, type Static } from "@sinclair/typebox";

export const SearchProfilesQuerySchema = Type.Object({
    q: Type.String({
        minLength: 2,
        maxLength: 50,
        description: "Search term for username or full name",
    }),
    limit: Type.Optional(Type.Number({ minimum: 1, maximum: 50, default: 10 })),
});

export type SearchProfilesQuery = Static<typeof SearchProfilesQuerySchema>;
