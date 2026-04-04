import { Type, type Static } from "@sinclair/typebox";

export const getTrendsQuerySchema = Type.Object({
    limit: Type.Optional(
        Type.Number({
            default: 10,
            minimum: 1,
            maximum: 50,
        }),
    ),
});

export type GetTrendsQuery = Static<typeof getTrendsQuerySchema>;
