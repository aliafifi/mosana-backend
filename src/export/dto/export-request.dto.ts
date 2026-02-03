import { IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ExportFormat } from '../schemas/export.schema';

export class ExportRequestDto {
  @IsOptional()
  @IsEnum(ExportFormat)
  format?: ExportFormat;

  @IsOptional()
  @IsBoolean()
  uploadToArweave?: boolean; // Permanent storage

  @IsOptional()
  @IsBoolean()
  includeMedia?: boolean; // Include image/video URLs
}
