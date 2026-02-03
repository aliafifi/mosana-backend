import { Document, Types } from 'mongoose';
export type DaoDocument = Document & Dao;
export declare class Dao {
    name: string;
    description: string;
    logoUrl?: string;
    creator: string;
    minTokensRequired: number;
    members: string[];
    memberCount: number;
    proposalCount: number;
    status: string;
    votingPeriodDays: number;
    quorumPercentage: number;
    reputationWeighted: boolean;
    settings: {
        allowProposalsFrom?: 'anyone' | 'members' | 'creator';
        minTokensToPropose?: number;
        minReputationToPropose?: number;
    };
    treasuryBalance: number;
    tags: string[];
}
export declare const DaoSchema: import("mongoose").Schema<Dao, import("mongoose").Model<Dao, any, any, any, (Document<unknown, any, Dao, any, import("mongoose").DefaultSchemaOptions> & Dao & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Dao, any, import("mongoose").DefaultSchemaOptions> & Dao & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Dao>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Dao, Document<unknown, {}, Dao, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Dao & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Dao, Document<unknown, {}, Dao, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Dao & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, Dao, Document<unknown, {}, Dao, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Dao & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    logoUrl?: import("mongoose").SchemaDefinitionProperty<string | undefined, Dao, Document<unknown, {}, Dao, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Dao & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    creator?: import("mongoose").SchemaDefinitionProperty<string, Dao, Document<unknown, {}, Dao, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Dao & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    minTokensRequired?: import("mongoose").SchemaDefinitionProperty<number, Dao, Document<unknown, {}, Dao, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Dao & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    members?: import("mongoose").SchemaDefinitionProperty<string[], Dao, Document<unknown, {}, Dao, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Dao & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    memberCount?: import("mongoose").SchemaDefinitionProperty<number, Dao, Document<unknown, {}, Dao, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Dao & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    proposalCount?: import("mongoose").SchemaDefinitionProperty<number, Dao, Document<unknown, {}, Dao, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Dao & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Dao, Document<unknown, {}, Dao, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Dao & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    votingPeriodDays?: import("mongoose").SchemaDefinitionProperty<number, Dao, Document<unknown, {}, Dao, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Dao & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    quorumPercentage?: import("mongoose").SchemaDefinitionProperty<number, Dao, Document<unknown, {}, Dao, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Dao & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reputationWeighted?: import("mongoose").SchemaDefinitionProperty<boolean, Dao, Document<unknown, {}, Dao, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Dao & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    settings?: import("mongoose").SchemaDefinitionProperty<{
        allowProposalsFrom?: "anyone" | "members" | "creator";
        minTokensToPropose?: number;
        minReputationToPropose?: number;
    }, Dao, Document<unknown, {}, Dao, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Dao & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    treasuryBalance?: import("mongoose").SchemaDefinitionProperty<number, Dao, Document<unknown, {}, Dao, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Dao & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    tags?: import("mongoose").SchemaDefinitionProperty<string[], Dao, Document<unknown, {}, Dao, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Dao & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Dao>;
