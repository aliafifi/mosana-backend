import { IsString, IsNotEmpty, IsNumber, Min, Max, IsOptional, MaxLength, IsIn } from 'class-validator';

export class CreateTipDto {
  @IsString()
  @IsNotEmpty({ message: 'Recipient wallet address is required' })
  toWallet: string;

  @IsNumber()
  @Min(10, { message: 'Minimum tip is 10 tokens' })
  @Max(10_000_000, { message: 'Maximum tip is 10,000,000 tokens' })
  amount: number;

  @IsString()
  @IsIn(['MOSANA', 'SOL'], { message: 'Currency must be MOSANA or SOL' })
  currency: string;

  @IsOptional()
  @IsString()
  postId?: string; // Tip for a specific post

  @IsOptional()
  @IsString()
  commentId?: string; // Tip for a specific comment

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Message cannot exceed 500 characters' })
  message?: string; // Optional message with tip
}
