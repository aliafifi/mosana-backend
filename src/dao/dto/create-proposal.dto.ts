import { IsString, IsNotEmpty, IsOptional, IsUrl, IsIn, MaxLength } from 'class-validator';

export class CreateProposalDto {
  @IsString()
  @IsNotEmpty({ message: 'Proposal title is required' })
  @MaxLength(200, { message: 'Title cannot exceed 200 characters' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Proposal description is required' })
  @MaxLength(5000, { message: 'Description cannot exceed 5000 characters' })
  description: string;

  @IsOptional()
  @IsIn(['governance', 'treasury', 'feature', 'partnership', 'charity', 'other'])
  category?: string;

  @IsOptional()
  @IsUrl({}, { each: true })
  attachments?: string[];

  @IsOptional()
  @IsUrl()
  discussionUrl?: string;
}
