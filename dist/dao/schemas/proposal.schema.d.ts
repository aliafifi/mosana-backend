import { Document, Types } from 'mongoose';
export type ProposalDocument = Document & Proposal;
export declare class Vote {
    walletAddress: string;
    vote: string;
    weight: number;
    votedAt: Date;
}
export declare class Proposal {
    daoId: Types.ObjectId;
    title: string;
    description: string;
    proposer: string;
    status: string;
    votingStartsAt: Date;
    votingEndsAt: Date;
    votes: Vote[];
    yesVotes: number;
    noVotes: number;
    abstainVotes: number;
    totalVotes: number;
    participationRate: number;
    executedAt?: Date;
    executedBy?: string;
    executionTransactionHash?: string;
    metadata: {
        category?: string;
        attachments?: string[];
        discussionUrl?: string;
    };
}
export declare const ProposalSchema: import("mongoose").Schema<Proposal, import("mongoose").Model<Proposal, any, any, any, (Document<unknown, any, Proposal, any, import("mongoose").DefaultSchemaOptions> & Proposal & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Proposal, any, import("mongoose").DefaultSchemaOptions> & Proposal & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Proposal>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Proposal, Document<unknown, {}, Proposal, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Proposal & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    daoId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Proposal, Document<unknown, {}, Proposal, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Proposal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, Proposal, Document<unknown, {}, Proposal, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Proposal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, Proposal, Document<unknown, {}, Proposal, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Proposal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    proposer?: import("mongoose").SchemaDefinitionProperty<string, Proposal, Document<unknown, {}, Proposal, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Proposal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Proposal, Document<unknown, {}, Proposal, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Proposal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    votingStartsAt?: import("mongoose").SchemaDefinitionProperty<Date, Proposal, Document<unknown, {}, Proposal, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Proposal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    votingEndsAt?: import("mongoose").SchemaDefinitionProperty<Date, Proposal, Document<unknown, {}, Proposal, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Proposal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    votes?: import("mongoose").SchemaDefinitionProperty<Vote[], Proposal, Document<unknown, {}, Proposal, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Proposal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    yesVotes?: import("mongoose").SchemaDefinitionProperty<number, Proposal, Document<unknown, {}, Proposal, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Proposal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    noVotes?: import("mongoose").SchemaDefinitionProperty<number, Proposal, Document<unknown, {}, Proposal, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Proposal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    abstainVotes?: import("mongoose").SchemaDefinitionProperty<number, Proposal, Document<unknown, {}, Proposal, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Proposal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    totalVotes?: import("mongoose").SchemaDefinitionProperty<number, Proposal, Document<unknown, {}, Proposal, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Proposal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    participationRate?: import("mongoose").SchemaDefinitionProperty<number, Proposal, Document<unknown, {}, Proposal, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Proposal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    executedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Proposal, Document<unknown, {}, Proposal, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Proposal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    executedBy?: import("mongoose").SchemaDefinitionProperty<string | undefined, Proposal, Document<unknown, {}, Proposal, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Proposal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    executionTransactionHash?: import("mongoose").SchemaDefinitionProperty<string | undefined, Proposal, Document<unknown, {}, Proposal, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Proposal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    metadata?: import("mongoose").SchemaDefinitionProperty<{
        category?: string;
        attachments?: string[];
        discussionUrl?: string;
    }, Proposal, Document<unknown, {}, Proposal, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Proposal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Proposal>;
