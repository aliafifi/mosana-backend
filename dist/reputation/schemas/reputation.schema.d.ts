import { Document } from 'mongoose';
export type ReputationDocument = Reputation & Document;
export declare class Reputation {
    walletAddress: string;
    totalScore: number;
    level: string;
    breakdown: {
        accountAge: {
            points: number;
            maxPoints: number;
        };
        engagement: {
            points: number;
            maxPoints: number;
        };
        economic: {
            points: number;
            maxPoints: number;
        };
        socialGood: {
            points: number;
            maxPoints: number;
        };
        dao: {
            points: number;
            maxPoints: number;
        };
        nft: {
            points: number;
            maxPoints: number;
        };
        trust: {
            points: number;
            maxPoints: number;
        };
    };
    metrics: {
        totalPosts: number;
        totalLikes: number;
        totalComments: number;
        tipsReceived: number;
        tipsSent: number;
        nftsMinted: number;
        nftsSold: number;
        nftRevenue: number;
        charityDonations: number;
        daosJoined: number;
        proposalsCreated: number;
        votesCast: number;
        venturesJoined: number;
    };
    penalties: Array<{
        reason: string;
        points: number;
        date: Date;
        adminWallet?: string;
        details?: string;
    }>;
    badges: string[];
    lastCalculated: Date;
    firstActivity: Date;
    rewardMultiplier: number;
    isFlagged: boolean;
    flagReason?: string;
    calculationCount: number;
}
export declare const ReputationSchema: import("mongoose").Schema<Reputation, import("mongoose").Model<Reputation, any, any, any, (Document<unknown, any, Reputation, any, import("mongoose").DefaultSchemaOptions> & Reputation & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Reputation, any, import("mongoose").DefaultSchemaOptions> & Reputation & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, Reputation>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Reputation, Document<unknown, {}, Reputation, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Reputation & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    walletAddress?: import("mongoose").SchemaDefinitionProperty<string, Reputation, Document<unknown, {}, Reputation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Reputation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    totalScore?: import("mongoose").SchemaDefinitionProperty<number, Reputation, Document<unknown, {}, Reputation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Reputation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    level?: import("mongoose").SchemaDefinitionProperty<string, Reputation, Document<unknown, {}, Reputation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Reputation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    breakdown?: import("mongoose").SchemaDefinitionProperty<{
        accountAge: {
            points: number;
            maxPoints: number;
        };
        engagement: {
            points: number;
            maxPoints: number;
        };
        economic: {
            points: number;
            maxPoints: number;
        };
        socialGood: {
            points: number;
            maxPoints: number;
        };
        dao: {
            points: number;
            maxPoints: number;
        };
        nft: {
            points: number;
            maxPoints: number;
        };
        trust: {
            points: number;
            maxPoints: number;
        };
    }, Reputation, Document<unknown, {}, Reputation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Reputation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    metrics?: import("mongoose").SchemaDefinitionProperty<{
        totalPosts: number;
        totalLikes: number;
        totalComments: number;
        tipsReceived: number;
        tipsSent: number;
        nftsMinted: number;
        nftsSold: number;
        nftRevenue: number;
        charityDonations: number;
        daosJoined: number;
        proposalsCreated: number;
        votesCast: number;
        venturesJoined: number;
    }, Reputation, Document<unknown, {}, Reputation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Reputation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    penalties?: import("mongoose").SchemaDefinitionProperty<{
        reason: string;
        points: number;
        date: Date;
        adminWallet?: string;
        details?: string;
    }[], Reputation, Document<unknown, {}, Reputation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Reputation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    badges?: import("mongoose").SchemaDefinitionProperty<string[], Reputation, Document<unknown, {}, Reputation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Reputation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lastCalculated?: import("mongoose").SchemaDefinitionProperty<Date, Reputation, Document<unknown, {}, Reputation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Reputation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    firstActivity?: import("mongoose").SchemaDefinitionProperty<Date, Reputation, Document<unknown, {}, Reputation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Reputation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    rewardMultiplier?: import("mongoose").SchemaDefinitionProperty<number, Reputation, Document<unknown, {}, Reputation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Reputation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isFlagged?: import("mongoose").SchemaDefinitionProperty<boolean, Reputation, Document<unknown, {}, Reputation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Reputation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    flagReason?: import("mongoose").SchemaDefinitionProperty<string | undefined, Reputation, Document<unknown, {}, Reputation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Reputation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    calculationCount?: import("mongoose").SchemaDefinitionProperty<number, Reputation, Document<unknown, {}, Reputation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Reputation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Reputation>;
