import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";
//이게 그럼
export class SignUpDto {
    @IsEmail({},
        {message: '올바른 이메일 형식을 입력해주세요.'}
    )
    @Matches(/^[^\u3131-\u318E\uAC00-\uD7A3]+$/, {
        message: '이메일에는 한글을 사용할 수 없습니다.',
    })
    
    email: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    //영어랑 숫자만 가능한 유효성
    @Matches(/^[a-zA-Z0-9]*$/, {
        message: 'password only accepts english and number'
    })
    password: string;
}

export class SignInDto {
    @IsEmail({},
        {message: '올바른 이메일 형식을 입력해주세요.'}
    )
    @Matches(/^[^\u3131-\u318E\uAC00-\uD7A3]+$/, {
        message: '이메일에는 한글을 사용할 수 없습니다.',
    })
    email: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    //영어랑 숫자만 가능한 유효성
    @Matches(/^[a-zA-Z0-9]*$/, {
        message: 'password only accepts english and number'
    })
    password: string;
}