import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class CastVoteDto {
  @IsString()
  @IsIn(['yes', 'no', 'abstain'], { message: 'Vote must be yes, no, or abstain' })
  @IsNotEmpty({ message: 'Vote is required' })
  vote: string;
}
