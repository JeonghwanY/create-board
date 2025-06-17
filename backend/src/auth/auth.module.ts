import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])//forFeature는 이 보드안에 User라는 레포지토리를 넣어주는 것
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
