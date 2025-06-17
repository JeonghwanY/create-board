import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from './comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment])
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService] // 다른 모듈에서 사용할 수 있도록 export
})
export class CommentsModule {} 