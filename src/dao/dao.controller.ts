import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException
} from '@nestjs/common';
import { DaoService } from './dao.service';
import { CreateDaoDto } from './dto/create-dao.dto';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { CastVoteDto } from './dto/cast-vote.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MongoIdPipe } from '../common/pipes/mongodb-id.pipe';

@Controller('dao')
export class DaoController {
  constructor(private readonly daoService: DaoService) {}

  // ============================================================================
  // DAO MANAGEMENT ENDPOINTS
  // ============================================================================

  /**
   * CREATE DAO
   * POST /api/dao
   * Protected: Yes (requires login)
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createDao(
    @Body() createDaoDto: CreateDaoDto,
    @Request() req,
  ) {
    try {
      const dao = await this.daoService.createDao(
        createDaoDto,
        req.user.walletAddress,
      );

      return {
        success: true,
        message: 'DAO created successfully',
        data: dao,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * GET ALL DAOs
   * GET /api/dao
   * Query params: ?status=active&sortBy=memberCount
   * Protected: No (public)
   */
  @Get()
  async getAllDaos(
    @Query('status') status?: string,
    @Query('sortBy') sortBy?: string,
  ) {
    try {
      const daos = await this.daoService.getAllDaos(status, sortBy);

      return {
        success: true,
        count: daos.length,
        data: daos,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * GET DAO BY ID
   * GET /api/dao/:daoId
   * Protected: No (public)
   */
  @Get(':daoId')
  async getDaoById(@Param('daoId', MongoIdPipe) daoId: string) {
    try {
      const dao = await this.daoService.getDaoById(daoId);

      return {
        success: true,
        data: dao,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * GET MY DAOs
   * GET /api/dao/my/daos
   * Protected: Yes (requires login)
   */
  @Get('my/daos')
  @UseGuards(JwtAuthGuard)
  async getMyDaos(@Request() req) {
    try {
      const daos = await this.daoService.getUserDaos(req.user.walletAddress);

      return {
        success: true,
        count: daos.length,
        data: daos,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * JOIN DAO
   * POST /api/dao/:daoId/join
   * Protected: Yes (requires login)
   */
  @Post(':daoId/join')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async joinDao(
    @Param('daoId', MongoIdPipe) daoId: string,
    @Request() req,
  ) {
    try {
      const dao = await this.daoService.joinDao(daoId, req.user.walletAddress);

      return {
        success: true,
        message: 'Successfully joined DAO',
        data: dao,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * LEAVE DAO
   * DELETE /api/dao/:daoId/leave
   * Protected: Yes (requires login)
   */
  @Delete(':daoId/leave')
  @UseGuards(JwtAuthGuard)
  async leaveDao(
    @Param('daoId', MongoIdPipe) daoId: string,
    @Request() req,
  ) {
    try {
      const dao = await this.daoService.leaveDao(daoId, req.user.walletAddress);

      return {
        success: true,
        message: 'Successfully left DAO',
        data: dao,
      };
    } catch (error) {
      throw error;
    }
  }

  // ============================================================================
  // PROPOSAL ENDPOINTS
  // ============================================================================

  /**
   * CREATE PROPOSAL
   * POST /api/dao/:daoId/proposals
   * Protected: Yes (requires login)
   */
  @Post(':daoId/proposals')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createProposal(
    @Param('daoId', MongoIdPipe) daoId: string,
    @Body() createProposalDto: CreateProposalDto,
    @Request() req,
  ) {
    try {
      const proposal = await this.daoService.createProposal(
        daoId,
        createProposalDto,
        req.user.walletAddress,
      );

      return {
        success: true,
        message: 'Proposal created successfully',
        data: proposal,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * GET ALL PROPOSALS FOR A DAO
   * GET /api/dao/:daoId/proposals
   * Query params: ?status=active
   * Protected: No (public)
   */
  @Get(':daoId/proposals')
  async getDaoProposals(
    @Param('daoId', MongoIdPipe) daoId: string,
    @Query('status') status?: string,
  ) {
    try {
      const proposals = await this.daoService.getDaoProposals(daoId, status);

      return {
        success: true,
        count: proposals.length,
        data: proposals,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * GET PROPOSAL BY ID
   * GET /api/dao/:daoId/proposals/:proposalId
   * Protected: No (public)
   */
  @Get(':daoId/proposals/:proposalId')
  async getProposalById(
    @Param('proposalId', MongoIdPipe) proposalId: string,
  ) {
    try {
      const proposal = await this.daoService.getProposalById(proposalId);

      return {
        success: true,
        data: proposal,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * CAST VOTE ON PROPOSAL
   * POST /api/dao/:daoId/proposals/:proposalId/vote
   * Protected: Yes (requires login)
   */
  @Post(':daoId/proposals/:proposalId/vote')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async castVote(
    @Param('proposalId', MongoIdPipe) proposalId: string,
    @Body() castVoteDto: CastVoteDto,
    @Request() req,
  ) {
    try {
      const proposal = await this.daoService.castVote(
        proposalId,
        castVoteDto,
        req.user.walletAddress,
      );

      return {
        success: true,
        message: 'Vote cast successfully',
        data: proposal,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * GET USER'S VOTE ON PROPOSAL
   * GET /api/dao/:daoId/proposals/:proposalId/my-vote
   * Protected: Yes (requires login)
   */
  @Get(':daoId/proposals/:proposalId/my-vote')
  @UseGuards(JwtAuthGuard)
  async getMyVote(
    @Param('proposalId', MongoIdPipe) proposalId: string,
    @Request() req,
  ) {
    try {
      const vote = await this.daoService.getUserVoteOnProposal(
        proposalId,
        req.user.walletAddress,
      );

      return {
        success: true,
        data: vote,
      };
    } catch (error) {
      throw error;
    }
  }

  // ============================================================================
  // STATISTICS ENDPOINTS
  // ============================================================================

  /**
   * GET DAO STATISTICS
   * GET /api/dao/:daoId/stats
   * Protected: No (public)
   */
  @Get(':daoId/stats')
  async getDaoStats(@Param('daoId') daoId: string) {
    try {
      const stats = await this.daoService.getDaoStats(daoId);

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * GET PLATFORM-WIDE DAO STATISTICS
   * GET /api/dao/stats/platform
   * Protected: No (public)
   */
  @Get('stats/platform')
  async getPlatformStats() {
    try {
      const stats = await this.daoService.getPlatformStats();

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      throw error;
    }
  }
}
