import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MusicRecommendationController } from './music-recommendation.controller';
import { MusicRecommendationService } from './music-recommendation.service';

@Module({
  imports: [ConfigModule],
  controllers: [MusicRecommendationController],
  providers: [MusicRecommendationService],
  exports: [MusicRecommendationService]
})
export class MusicRecommendationModule {} 