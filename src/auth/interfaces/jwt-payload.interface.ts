export interface JwtPayload {
  walletAddress: string;
  sub: string; // MongoDB user ID
  iat?: number; // Issued at (timestamp)
  exp?: number; // Expiration (timestamp)
}
