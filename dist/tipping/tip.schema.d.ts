import { Document } from 'mongoose';
export type TipDocument = Tip & Document;
export declare class Tip {
    fromWallet: string;
    toWallet: string;
    amount: number;
    currency: string;
    platformFee: number;
    feePercentage: number;
    amountBurned: number;
    amountToRewards: number;
    transactionSignature: string;
    postId: string;
    commentId: string;
    message: string;
    status: string;
    tippedAt: Date;
}
export declare const TipSchema: import("mongoose").Schema<Tip, import("mongoose").Model<Tip, any, any, any, (Document<unknown, any, Tip, any, import("mongoose").DefaultSchemaOptions> & Tip & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Tip, any, import("mongoose").DefaultSchemaOptions> & Tip & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, Tip>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Tip, Document<unknown, {}, Tip, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Tip & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    fromWallet?: import("mongoose").SchemaDefinitionProperty<string, Tip, Document<unknown, {}, Tip, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Tip & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    toWallet?: import("mongoose").SchemaDefinitionProperty<string, Tip, Document<unknown, {}, Tip, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Tip & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    amount?: import("mongoose").SchemaDefinitionProperty<number, Tip, Document<unknown, {}, Tip, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Tip & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    currency?: import("mongoose").SchemaDefinitionProperty<string, Tip, Document<unknown, {}, Tip, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Tip & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    platformFee?: import("mongoose").SchemaDefinitionProperty<number, Tip, Document<unknown, {}, Tip, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Tip & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    feePercentage?: import("mongoose").SchemaDefinitionProperty<number, Tip, Document<unknown, {}, Tip, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Tip & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    amountBurned?: import("mongoose").SchemaDefinitionProperty<number, Tip, Document<unknown, {}, Tip, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Tip & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    amountToRewards?: import("mongoose").SchemaDefinitionProperty<number, Tip, Document<unknown, {}, Tip, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Tip & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    transactionSignature?: import("mongoose").SchemaDefinitionProperty<string, Tip, Document<unknown, {}, Tip, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Tip & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    postId?: import("mongoose").SchemaDefinitionProperty<string, Tip, Document<unknown, {}, Tip, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Tip & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    commentId?: import("mongoose").SchemaDefinitionProperty<string, Tip, Document<unknown, {}, Tip, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Tip & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    message?: import("mongoose").SchemaDefinitionProperty<string, Tip, Document<unknown, {}, Tip, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Tip & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Tip, Document<unknown, {}, Tip, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Tip & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    tippedAt?: import("mongoose").SchemaDefinitionProperty<Date, Tip, Document<unknown, {}, Tip, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Tip & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Tip>;
