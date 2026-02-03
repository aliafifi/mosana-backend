import { IsEnum, IsOptional, IsString } from 'class-validator';
import { VerificationProvider } from '../schemas/verification.schema';

export class CheckVerificationDto {
  @IsOptional()
  @IsEnum(VerificationProvider)
  provider?: VerificationProvider;

  @IsOptional()
  @IsString()
  schemaAddress?: string; // Optional: specific schema to check

  @IsOptional()
  @IsString()
  credentialAddress?: string; // Optional: specific credential to check
}
