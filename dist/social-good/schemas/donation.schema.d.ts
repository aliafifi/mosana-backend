import { Document, Types } from 'mongoose';
export type DonationDocument = Donation & Document;
export declare class Donation {
    donorWallet: string;
    causeId: Types.ObjectId;
    amount: number;
    pledgePercentage: number;
    source: string;
    originalAmount: number;
    sourceTransactionId?: string;
    donationTransactionHash?: string;
}
export declare const DonationSchema: import("mongoose").Schema<Donation, import("mongoose").Model<Donation, any, any, any, (Document<unknown, any, Donation, any, import("mongoose").DefaultSchemaOptions> & Donation & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Donation, any, import("mongoose").DefaultSchemaOptions> & Donation & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Donation>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Donation, Document<unknown, {}, Donation, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donation & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    donorWallet?: import("mongoose").SchemaDefinitionProperty<string, Donation, Document<unknown, {}, Donation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    causeId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Donation, Document<unknown, {}, Donation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    amount?: import("mongoose").SchemaDefinitionProperty<number, Donation, Document<unknown, {}, Donation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    pledgePercentage?: import("mongoose").SchemaDefinitionProperty<number, Donation, Document<unknown, {}, Donation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    source?: import("mongoose").SchemaDefinitionProperty<string, Donation, Document<unknown, {}, Donation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    originalAmount?: import("mongoose").SchemaDefinitionProperty<number, Donation, Document<unknown, {}, Donation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sourceTransactionId?: import("mongoose").SchemaDefinitionProperty<string | undefined, Donation, Document<unknown, {}, Donation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    donationTransactionHash?: import("mongoose").SchemaDefinitionProperty<string | undefined, Donation, Document<unknown, {}, Donation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Donation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Donation>;
