import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

// ============================================
// PENALTY DTO
// Used when an admin manually applies a penalty to a user
// ============================================

export class ApplyPenaltyDto {
  // The user's wallet address (required)
  @IsString()
  walletAddress: string;

  // Reason for the penalty (required)
  // Examples: 'spam_report', 'fake_engagement', 'admin_warning'
  @IsString()
  reason: string;

  // Penalty points (must be negative, max -500)
  @IsNumber()
  @Min(-500)  // Can't be worse than -500
  @Max(0)     // Must be negative (0 or below)
  points: number;

  // Optional: Additional details about the penalty
  @IsOptional()
  @IsString()
  details?: string;
}
