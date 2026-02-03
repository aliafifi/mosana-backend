import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class SetNftPfpDto {
  @IsString()
  @IsNotEmpty({ message: 'NFT mint address is required' })
  @Length(32, 44, { message: 'Invalid Solana address length' })
  @Matches(/^[1-9A-HJ-NP-Za-km-z]+$/, {
    message: 'Invalid Solana address format (must be base58)',
  })
  nftMintAddress: string;
}
