import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import {  SignInDto, SignUpDto } from './dto/auth-credential.dto';
import *as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    constructor(
    @InjectRepository(User)//user repository를 authservice에서 사용하기 위해 이렇게 구현, entity를 넣으면 자동으로 바뀜 repository로
        private readonly userRepository: Repository<User>,//Repository<User>==userRepository  
        private jwtService: JwtService
    ) { }

    async signUp(authCredentialsDto: SignUpDto): Promise<void>{
        const { email, username, password} = authCredentialsDto;

        const salt = await bcrypt.genSalt();//솔트 + 해시로 암호화 구현
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.userRepository.create({email, username, password: hashedPassword });
        //await this.userRepository.save(user);
        try {
            await this.userRepository.save(user);
        } catch (error) {
            if(error.code === '23505'){
                throw new ConflictException('Existing username');
            }else{
                throw new InternalServerErrorException();
            }
            //console.log('error',error)
        }
    }
    async signIn(authCredentialsDto: SignInDto): Promise<{accessToken: string}>{
        const{email,password} = authCredentialsDto;
        const user = await this.userRepository.findOne({
            where: { email },
        });

        if(user && (await bcrypt.compare(password,user.password))){
            //로그인 성공하면 유저 토큰 생성 ( Secret + Payload)
            const payload = { email };
            const accessToken = await this.jwtService.sign(payload);

            return { accessToken };
        } else {
            throw new UnauthorizedException('login failed')
        }
    }
}
