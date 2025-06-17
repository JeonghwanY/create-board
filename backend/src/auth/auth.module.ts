import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),//auth 모듈 imports에 넣어주기
    JwtModule.register({
      secret: 'Secret1234',
      signOptions:{
        expiresIn: 60 * 60,
      }
    }),
    TypeOrmModule.forFeature([User])//forFeature는 이 보드안에 User라는 레포지토리를 넣어주는 것
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
