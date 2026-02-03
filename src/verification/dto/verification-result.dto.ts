import { VerificationProvider, VerificationStatus } from '../schemas/verification.schema';

export class VerificationResultDto {
  walletAddress: string;
  isVerified: boolean;
  verifications: VerificationDetail[];
  totalMultiplierBonus: number;
  highestVerification?: VerificationProvider;
}

export class VerificationDetail {
  provider: VerificationProvider;
  providerName: string;
  status: VerificationStatus;
  multiplierBonus: number;
  verifiedAt?: Date;
  expiresAt?: Date;
  attestationAddress?: string;
  daysUntilExpiry?: number;
}

export class ProviderListDto {
  provider: VerificationProvider;
  name: string;
  description: string;
  multiplierBonus: number;
  enabled: boolean;
}
