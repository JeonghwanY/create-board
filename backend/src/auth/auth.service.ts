import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credential.dto';

@Injectable()
export class AuthService {
    constructor(
    @InjectRepository(User)//user repository를 authservice에서 사용하기 위해 이렇게 구현, entity를 넣으면 자동으로 바뀜 repository로
        private readonly userRepository: Repository<User>,//Repository<User>==userRepository  
    ) { }

    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void>{
        const { email, username, password} = authCredentialsDto;
        const user = this.userRepository.create({email, username, password })
    }
}
