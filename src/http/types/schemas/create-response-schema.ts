import { type TSchema, Type } from "@fastify/type-provider-typebox";

const MetaSchema = Type.Object({
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
