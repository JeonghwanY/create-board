import { IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
    @IsString()
    @IsOptional()
    title?: string; // 게시글 제목

    @IsString()
    @IsOptional()
    detail?: string; // 게시글 내용
} 