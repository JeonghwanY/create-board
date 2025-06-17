import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth-credential.dto';


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

}
