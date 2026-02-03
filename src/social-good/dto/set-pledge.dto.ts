import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class SetPledgeDto {
  @IsString()
  @IsNotEmpty()
  causeId: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  pledgePercentage: number;
}
