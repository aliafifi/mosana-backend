import { Document, Types } from 'mongoose';
export type NftDocument = Nft & Document;
export declare class Nft {
    postId: Types.ObjectId;
    mintAddress: string;
    metadataUri: string;
    creator: string;
    owner: string;
    royaltyPercentage: number;
    isBurned: boolean;
    transactionHash?: string;
    engagementSnapshot?: {
        likes: number;
        comments: number;
        tips: number;
    };
}
export declare const NftSchema: import("mongoose").Schema<Nft, import("mongoose").Model<Nft, any, any, any, (Document<unknown, any, Nft, any, import("mongoose").DefaultSchemaOptions> & Nft & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Nft, any, import("mongoose").DefaultSchemaOptions> & Nft & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Nft>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Nft, Document<unknown, {}, Nft, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Nft & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    postId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Nft, Document<unknown, {}, Nft, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Nft & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    mintAddress?: import("mongoose").SchemaDefinitionProperty<string, Nft, Document<unknown, {}, Nft, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Nft & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    metadataUri?: import("mongoose").SchemaDefinitionProperty<string, Nft, Document<unknown, {}, Nft, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Nft & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    creator?: import("mongoose").SchemaDefinitionProperty<string, Nft, Document<unknown, {}, Nft, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Nft & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    owner?: import("mongoose").SchemaDefinitionProperty<string, Nft, Document<unknown, {}, Nft, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Nft & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    royaltyPercentage?: import("mongoose").SchemaDefinitionProperty<number, Nft, Document<unknown, {}, Nft, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Nft & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isBurned?: import("mongoose").SchemaDefinitionProperty<boolean, Nft, Document<unknown, {}, Nft, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Nft & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    transactionHash?: import("mongoose").SchemaDefinitionProperty<string | undefined, Nft, Document<unknown, {}, Nft, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Nft & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    engagementSnapshot?: import("mongoose").SchemaDefinitionProperty<{
        likes: number;
        comments: number;
        tips: number;
    } | undefined, Nft, Document<unknown, {}, Nft, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Nft & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Nft>;
