import { Document, Types } from 'mongoose';
export type RevenueSplitDocument = RevenueSplit & Document;
declare class CollaboratorPayment {
    walletAddress: string;
    amount: number;
    sharePercentage: number;
    transactionHash?: string;
}
export declare class RevenueSplit {
    ventureId: Types.ObjectId;
    postId: Types.ObjectId;
    totalAmount: number;
    source: string;
    payments: CollaboratorPayment[];
    sender?: string;
    sourceTransactionId?: string;
}
export declare const RevenueSplitSchema: import("mongoose").Schema<RevenueSplit, import("mongoose").Model<RevenueSplit, any, any, any, (Document<unknown, any, RevenueSplit, any, import("mongoose").DefaultSchemaOptions> & RevenueSplit & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, RevenueSplit, any, import("mongoose").DefaultSchemaOptions> & RevenueSplit & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, RevenueSplit>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, RevenueSplit, Document<unknown, {}, RevenueSplit, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<RevenueSplit & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    ventureId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, RevenueSplit, Document<unknown, {}, RevenueSplit, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<RevenueSplit & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    postId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, RevenueSplit, Document<unknown, {}, RevenueSplit, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<RevenueSplit & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    totalAmount?: import("mongoose").SchemaDefinitionProperty<number, RevenueSplit, Document<unknown, {}, RevenueSplit, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<RevenueSplit & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    source?: import("mongoose").SchemaDefinitionProperty<string, RevenueSplit, Document<unknown, {}, RevenueSplit, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<RevenueSplit & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    payments?: import("mongoose").SchemaDefinitionProperty<CollaboratorPayment[], RevenueSplit, Document<unknown, {}, RevenueSplit, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<RevenueSplit & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sender?: import("mongoose").SchemaDefinitionProperty<string | undefined, RevenueSplit, Document<unknown, {}, RevenueSplit, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<RevenueSplit & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sourceTransactionId?: import("mongoose").SchemaDefinitionProperty<string | undefined, RevenueSplit, Document<unknown, {}, RevenueSplit, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<RevenueSplit & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, RevenueSplit>;
export {};
