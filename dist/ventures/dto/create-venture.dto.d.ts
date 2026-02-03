export declare class CollaboratorDto {
    walletAddress: string;
    sharePercentage: number;
}
export declare class CreateVentureDto {
    postId: string;
    collaborators: CollaboratorDto[];
    description?: string;
}
