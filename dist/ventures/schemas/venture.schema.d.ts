import { Document, Types } from 'mongoose';
export type VentureDocument = Venture & Document;
declare class Collaborator {
    walletAddress: string;
    sharePercentage: number;
    hasAccepted: boolean;
}
export declare class Venture {
    postId: Types.ObjectId;
    initiator: string;
    collaborators: Collaborator[];
    status: string;
    totalRevenueGenerated: number;
    totalSplits: number;
    description?: string;
}
export declare const VentureSchema: import("mongoose").Schema<Venture, import("mongoose").Model<Venture, any, any, any, (Document<unknown, any, Venture, any, import("mongoose").DefaultSchemaOptions> & Venture & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Venture, any, import("mongoose").DefaultSchemaOptions> & Venture & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Venture>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Venture, Document<unknown, {}, Venture, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Venture & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    postId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Venture, Document<unknown, {}, Venture, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Venture & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    initiator?: import("mongoose").SchemaDefinitionProperty<string, Venture, Document<unknown, {}, Venture, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Venture & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    collaborators?: import("mongoose").SchemaDefinitionProperty<Collaborator[], Venture, Document<unknown, {}, Venture, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Venture & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Venture, Document<unknown, {}, Venture, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Venture & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    totalRevenueGenerated?: import("mongoose").SchemaDefinitionProperty<number, Venture, Document<unknown, {}, Venture, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Venture & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    totalSplits?: import("mongoose").SchemaDefinitionProperty<number, Venture, Document<unknown, {}, Venture, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Venture & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string | undefined, Venture, Document<unknown, {}, Venture, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Venture & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Venture>;
export {};
