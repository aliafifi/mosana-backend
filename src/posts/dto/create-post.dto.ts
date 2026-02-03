import { IsString, IsNotEmpty, MaxLength, IsArray, IsOptional, IsUrl, ArrayMaxSize, IsNumber, Min, Max, IsMongoId } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty({ message: 'Post content cannot be empty' })
  @MaxLength(5000, { message: 'Post content cannot exceed 5000 characters' })
  content: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10, { message: 'Cannot upload more than 10 media files' })
  @IsUrl({}, { each: true, message: 'Each media URL must be valid' })
  mediaUrls?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10, { message: 'Cannot add more than 10 tags' })
  @IsString({ each: true })
  @MaxLength(30, { each: true, message: 'Each tag cannot exceed 30 characters' })
  tags?: string[];

  // Charity donation fields (Feature 8: Social Good)
  @IsOptional()
  @IsMongoId({ message: 'Invalid charity ID' })
  dedicatedCause?: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Charity percentage cannot be negative' })
  @Max(100, { message: 'Charity percentage cannot exceed 100%' })
  charityPercentage?: number;
}
