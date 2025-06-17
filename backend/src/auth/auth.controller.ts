import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth-credential.dto';
import { AuthGuard } from '@nestjs/passport';


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
    test(@Req() req) {
        console.log('req', req);
    }

}
