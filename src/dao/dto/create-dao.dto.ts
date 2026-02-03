import { IsString, IsNotEmpty, IsNumber, IsOptional, IsUrl, Min, Max, IsArray, IsIn } from 'class-validator';

export class CreateDaoDto {
  @IsString()
  @IsNotEmpty({ message: 'DAO name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsOptional()
  @IsUrl({}, { message: 'Logo must be a valid URL' })
  logoUrl?: string;

  @IsNumber()
  @Min(100, { message: 'Minimum tokens must be at least 100' })
  @IsOptional()
  minTokensRequired?: number; // Defaults to 1000 in schema

  @IsNumber()
  @Min(1, { message: 'Voting period must be at least 1 day' })
  @Max(30, { message: 'Voting period cannot exceed 30 days' })
  @IsOptional()
  votingPeriodDays?: number; // Defaults to 7

  @IsNumber()
  @Min(1, { message: 'Quorum must be at least 1%' })
  @Max(100, { message: 'Quorum cannot exceed 100%' })
  @IsOptional()
  quorumPercentage?: number; // Defaults to 51

  @IsOptional()
  @IsIn(['anyone', 'members', 'creator'])
  allowProposalsFrom?: string; // Defaults to 'members'

  @IsOptional()
  @IsNumber()
  @Min(0)
  minTokensToPropose?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
