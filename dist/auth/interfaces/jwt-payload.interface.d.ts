export interface JwtPayload {
    walletAddress: string;
    sub: string;
    iat?: number;
    exp?: number;
}
