import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCommentDto {
    @IsString()
    @IsNotEmpty()
    c_detail: string; // 수정할 댓글 내용
} 