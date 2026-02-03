import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ExportService } from './export.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ExportRequestDto } from './dto/export-request.dto';
import { ExportResultDto } from './dto/export-result.dto';

@Controller('export')
@UseGuards(JwtAuthGuard) // All endpoints require authentication
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  /**
   * Request a data export
   * POST /api/export/request
   */
  @Post('request')
  async requestExport(
    @Req() req: any,
    @Body() dto: ExportRequestDto,
  ): Promise<{ success: boolean; message: string; data: ExportResultDto }> {
    const walletAddress = req.user.walletAddress;

    const result = await this.exportService.requestExport(walletAddress, dto);

    return {
      success: true,
      message: 'Export requested successfully. Processing in background.',
      data: result,
    };
  }

  /**
   * Get export status
   * GET /api/export/status/:exportId
   */
  @Get('status/:exportId')
  async getExportStatus(
    @Req() req: any,
    @Param('exportId') exportId: string,
  ): Promise<{ success: boolean; data: ExportResultDto }> {
    const walletAddress = req.user.walletAddress;

    const result = await this.exportService.getExportStatus(
      walletAddress,
      exportId,
    );

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Get export history
   * GET /api/export/history?limit=10
   */
  @Get('history')
  async getExportHistory(
    @Req() req: any,
    @Query('limit') limit?: number,
  ): Promise<{ success: boolean; data: ExportResultDto[] }> {
    const walletAddress = req.user.walletAddress;

    const result = await this.exportService.getExportHistory(
      walletAddress,
      limit ? Number(limit) : 10,
    );

    return {
      success: true,
      data: result,
    };
  }
}
