import { Type } from "@sinclair/typebox";
import { Type as FBType, type Static } from "@fastify/type-provider-typebox";
import { MetaOnlyResponseSchema } from "../create-response-schema";

const NotificationItemSchema = FBType.Object({
    recipientId: FBType.String({ format: "uuid" }),
    issuerId: FBType.String({ format: "uuid" }),
    username: FBType.Optional(FBType.String()),
    type: FBType.String(),
    avatarUrl: FBType.Optional(FBType.String()),
    referenceId: FBType.Optional(FBType.String()),
    createdAt: FBType.String(),
    isRead: FBType.Boolean(),
});

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

export const GetNotificationsResponseSchema = FBType.Object({
    data: FBType.Array(NotificationItemSchema),
    meta: FBType.Object({
        total: FBType.Number(),
        currentPage: FBType.Number(),
        totalPages: FBType.Number(),
        limit: FBType.Number(),
    }),
});
export type GetNotificationsResponse = Static<
    typeof GetNotificationsResponseSchema
>;

export const MarkAllReadResponseSchema = MetaOnlyResponseSchema;
export type MarkAllReadResponse = Static<typeof MarkAllReadResponseSchema>;
