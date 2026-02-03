import { IsString, IsNotEmpty, IsUrl, IsOptional, IsIn } from 'class-validator';

export class CreateCauseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @IsString()
  @IsIn(['education', 'healthcare', 'environment', 'poverty', 'humanitarian', 'animals', 'other'])
  category: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  @IsUrl()
  @IsOptional()
  logo?: string;
}
