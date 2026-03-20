import { Type, type Static } from "@sinclair/typebox";

export const GetNotificationsQuerySchema = Type.Object({
    page: Type.Optional(
        Type.Number({
            minimum: 1,
            default: 1,
        }),
    ),
    limit: Type.Optional(
        Type.Number({
            minimum: 1,
            maximum: 50,
            default: 10,
        }),
    ),
});

export type GetNotificationsQuery = Static<typeof GetNotificationsQuerySchema>;
