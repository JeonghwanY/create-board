import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    title: string; // 게시글 제목

    @IsString()
    @IsNotEmpty()
    detail: string; // 게시글 내용

    
} 