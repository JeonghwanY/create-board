import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth-credential.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

//
@Controller('auth')
export class AuthController {
    constructor( private authService: AuthService){}

    @Post('/signup')
    singUp(@Body(ValidationPipe) authcredentialsDto: SignUpDto): Promise<void> {
        return this.authService.signUp(authcredentialsDto);
    }
    @Post('/signin')
    signIn(@Body(ValidationPipe) authCredentialsDto: SignInDto): Promise<{accessToken: string}> {
        return this.authService.signIn(authCredentialsDto);
    }

    @Post('/test')
    @UseGuards(AuthGuard())
    test(@GetUser() user: User) {
        console.log('user', user);
    }
}
