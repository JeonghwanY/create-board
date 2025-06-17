import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
    @IsNumber()
    @IsNotEmpty()
    pid: number; // 게시글 ID

    @IsString()
    @IsNotEmpty()
    c_detail: string; // 댓글 내용

    @IsString()
    @IsNotEmpty()
    c_writer: string; // 댓글 작성자
} 