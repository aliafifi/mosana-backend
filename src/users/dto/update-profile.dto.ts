import { IsString, IsOptional, MaxLength, MinLength, Matches, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(30, { message: 'Username cannot exceed 30 characters' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  username?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Bio cannot exceed 500 characters' })
  bio?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Profile image must be a valid URL' })
  @MaxLength(2048, { message: 'Profile image URL is too long' })
  profileImage?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'SOL domain is too long' })
  @Matches(/^[a-zA-Z0-9_-]+\.sol$/, {
    message: 'Invalid SOL domain format (must end with .sol)',
  })
  solDomain?: string;
}
