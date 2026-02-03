import { Document } from 'mongoose';
export type RewardDocument = Reward & Document;
export type DailyEngagementDocument = DailyEngagement & Document;
export declare class DailyEngagement {
    walletAddress: string;
    date: Date;
    postsCreated: number;
    likesReceived: number;
    commentsReceived: number;
    viewsReceived: number;
    likesGiven: number;
    commentsGiven: number;
    totalPoints: number;
    tokensEarned: number;
    isDistributed: boolean;
}
export declare const DailyEngagementSchema: import("mongoose").Schema<DailyEngagement, import("mongoose").Model<DailyEngagement, any, any, any, (Document<unknown, any, DailyEngagement, any, import("mongoose").DefaultSchemaOptions> & DailyEngagement & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, DailyEngagement, any, import("mongoose").DefaultSchemaOptions> & DailyEngagement & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, DailyEngagement>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DailyEngagement, Document<unknown, {}, DailyEngagement, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<DailyEngagement & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    walletAddress?: import("mongoose").SchemaDefinitionProperty<string, DailyEngagement, Document<unknown, {}, DailyEngagement, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<DailyEngagement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    date?: import("mongoose").SchemaDefinitionProperty<Date, DailyEngagement, Document<unknown, {}, DailyEngagement, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<DailyEngagement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    postsCreated?: import("mongoose").SchemaDefinitionProperty<number, DailyEngagement, Document<unknown, {}, DailyEngagement, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<DailyEngagement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    likesReceived?: import("mongoose").SchemaDefinitionProperty<number, DailyEngagement, Document<unknown, {}, DailyEngagement, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<DailyEngagement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    commentsReceived?: import("mongoose").SchemaDefinitionProperty<number, DailyEngagement, Document<unknown, {}, DailyEngagement, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<DailyEngagement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    viewsReceived?: import("mongoose").SchemaDefinitionProperty<number, DailyEngagement, Document<unknown, {}, DailyEngagement, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<DailyEngagement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    likesGiven?: import("mongoose").SchemaDefinitionProperty<number, DailyEngagement, Document<unknown, {}, DailyEngagement, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<DailyEngagement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    commentsGiven?: import("mongoose").SchemaDefinitionProperty<number, DailyEngagement, Document<unknown, {}, DailyEngagement, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<DailyEngagement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    totalPoints?: import("mongoose").SchemaDefinitionProperty<number, DailyEngagement, Document<unknown, {}, DailyEngagement, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<DailyEngagement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    tokensEarned?: import("mongoose").SchemaDefinitionProperty<number, DailyEngagement, Document<unknown, {}, DailyEngagement, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<DailyEngagement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isDistributed?: import("mongoose").SchemaDefinitionProperty<boolean, DailyEngagement, Document<unknown, {}, DailyEngagement, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<DailyEngagement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, DailyEngagement>;
export declare class Reward {
    walletAddress: string;
    amount: number;
    date: Date;
    engagementPoints: number;
    transactionSignature: string;
    status: string;
}
export declare const RewardSchema: import("mongoose").Schema<Reward, import("mongoose").Model<Reward, any, any, any, (Document<unknown, any, Reward, any, import("mongoose").DefaultSchemaOptions> & Reward & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Reward, any, import("mongoose").DefaultSchemaOptions> & Reward & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, Reward>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Reward, Document<unknown, {}, Reward, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Reward & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    walletAddress?: import("mongoose").SchemaDefinitionProperty<string, Reward, Document<unknown, {}, Reward, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Reward & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    amount?: import("mongoose").SchemaDefinitionProperty<number, Reward, Document<unknown, {}, Reward, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Reward & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    date?: import("mongoose").SchemaDefinitionProperty<Date, Reward, Document<unknown, {}, Reward, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Reward & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    engagementPoints?: import("mongoose").SchemaDefinitionProperty<number, Reward, Document<unknown, {}, Reward, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Reward & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    transactionSignature?: import("mongoose").SchemaDefinitionProperty<string, Reward, Document<unknown, {}, Reward, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Reward & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Reward, Document<unknown, {}, Reward, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Reward & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Reward>;
