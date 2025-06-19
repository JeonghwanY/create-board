import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { MusicRecommendationService } from './music-recommendation.service';
import { MusicRecommendation } from './interfaces/music-recommendation.interface';

@Controller('api')
export class MusicRecommendationController {
  constructor(private readonly musicRecommendationService: MusicRecommendationService) {}

  @Get('recommend')
  async getRecommendation(): Promise<MusicRecommendation> {
    try {
      return await this.musicRecommendationService.getRecommendation();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '음악 추천을 가져오는 중 오류가 발생했습니다.',
          details: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 