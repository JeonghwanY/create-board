import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    title: string; // 게시글 제목

    @IsString()
    @IsNotEmpty()
    detail: string; // 게시글 내용

    @IsString()
    @IsNotEmpty()
    writer: string; // 게시글 작성자
} 