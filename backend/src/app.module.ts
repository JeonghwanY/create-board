import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './boards/configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    PostsModule,
    AuthModule,
    CommentsModule
  ],
})
export class AppModule {}

