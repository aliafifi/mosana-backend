import { VerificationProvider, VerificationStatus } from '../schemas/verification.schema';

// Result from checking on-chain verification
export interface OnChainVerificationResult {
  isVerified: boolean;
  provider: VerificationProvider;
  status: VerificationStatus;
  attestationAddress?: string;
  credentialAddress?: string;
  schemaAddress?: string;
  verifiedAt?: Date;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

// Configuration for each provider
export interface ProviderConfig {
  provider: VerificationProvider;
  name: string;
  description: string;
  multiplierBonus: number;
  requiredSchemaAddress?: string; // Known schema PDA for this provider
  requiredCredentialAddress?: string; // Known credential PDA
  enabled: boolean;
}

// Standard interface for verification providers
export interface IVerificationProvider {
  provider: VerificationProvider;
  
  // Check if wallet has valid verification on-chain
  checkVerification(walletAddress: string): Promise<OnChainVerificationResult>;
  
  // Get provider configuration
  getConfig(): ProviderConfig;
}

// Scoring multipliers for each provider
export const VERIFICATION_MULTIPLIERS: Record<VerificationProvider, number> = {
  [VerificationProvider.CIVIC_CAPTCHA]: 1.1,      // +10% (basic bot protection)
  [VerificationProvider.CIVIC_LIVENESS]: 1.3,     // +30% (video selfie)
  [VerificationProvider.CIVIC_UNIQUENESS]: 1.5,   // +50% (strongest PoH)
  [VerificationProvider.CIVIC_ID]: 1.5,           // +50% (government ID)
  [VerificationProvider.HUMANITY_PROTOCOL]: 2.0,  // +100% (biometric + ZK)
  [VerificationProvider.CUSTOM]: 1.2,             // +20% (custom verification)
};

// Provider display information
export const PROVIDER_INFO: Record<VerificationProvider, { name: string; description: string }> = {
  [VerificationProvider.CIVIC_CAPTCHA]: {
    name: 'Civic CAPTCHA Pass',
    description: 'Basic bot protection via CAPTCHA verification',
  },
  [VerificationProvider.CIVIC_LIVENESS]: {
    name: 'Civic Liveness Pass',
    description: 'Video selfie verification proving human presence',
  },
  [VerificationProvider.CIVIC_UNIQUENESS]: {
    name: 'Civic Uniqueness Pass',
    description: 'Strongest proof-of-personhood preventing duplicate accounts',
  },
  [VerificationProvider.CIVIC_ID]: {
    name: 'Civic ID Verification Pass',
    description: 'Government-issued ID matched with video selfie',
  },
  [VerificationProvider.HUMANITY_PROTOCOL]: {
    name: 'Humanity Protocol',
    description: 'Biometric verification with zero-knowledge proofs',
  },
  [VerificationProvider.CUSTOM]: {
    name: 'Custom Verification',
    description: 'Platform-specific verification method',
  },
};
