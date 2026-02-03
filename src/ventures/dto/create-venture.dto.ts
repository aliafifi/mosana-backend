import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class CollaboratorDto {
  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  sharePercentage: number;
}

export class CreateVentureDto {
  @IsString()
  @IsNotEmpty()
  postId: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one collaborator is required' })
  @ValidateNested({ each: true })
  @Type(() => CollaboratorDto)
  collaborators: CollaboratorDto[];

  @IsString()
  @IsOptional()
  description?: string;
}
