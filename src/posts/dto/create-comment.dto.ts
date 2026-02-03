import { IsString, IsNotEmpty, MaxLength, IsOptional, IsUrl } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({ message: 'Comment cannot be empty' })
  @MaxLength(1000, { message: 'Comment cannot exceed 1000 characters' })
  content: string;

  @IsOptional()
  @IsUrl({}, { message: 'GIF URL must be valid' })
  @MaxLength(2048, { message: 'GIF URL is too long' })
  gifUrl?: string;
}
