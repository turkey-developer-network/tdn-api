import {
    Type,
    type TSchema,
    type TObject,
    type TString,
} from "@sinclair/typebox";

export const createResponseSchema = <T extends TSchema>(
    dataSchema: T,
): TObject<{ data: T; meta: TObject<{ timestamp: TString }> }> => {
    return Type.Object({
        data: dataSchema,
        meta: Type.Object({
            timestamp: Type.String({ format: "date-time" }),
        }),
    });
};
