import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
    ) {}

    // 댓글 작성
    async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
        const { pid, c_detail, c_writer } = createCommentDto;
        
        const comment = this.commentRepository.create({
            pid,
            c_detail,
            c_writer,
        });

        await this.commentRepository.save(comment);
        return comment;
    }

    // 특정 게시글의 댓글 조회
    async getCommentsByBoardId(pid: number): Promise<Comment[]> {
        return this.commentRepository.find({
            where: { pid },
            order: { c_date: 'ASC' }, // 작성 시간 순으로 정렬
        });
    }

    // 댓글 ID로 댓글 조회
    async getCommentById(cid: number): Promise<Comment> {
        const comment = await this.commentRepository.findOne({
            where: { cid }
        });

        if (!comment) {
            throw new NotFoundException(`댓글 ID ${cid}를 찾을 수 없습니다`);
        }

        return comment;
    }

    // 댓글 수정
    async updateComment(cid: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
        const comment = await this.getCommentById(cid);
        const { c_detail } = updateCommentDto;

        comment.c_detail = c_detail;
        await this.commentRepository.save(comment);
        
        return comment;
    }

    // 댓글 삭제
    async deleteComment(cid: number): Promise<void> {
        const result = await this.commentRepository.delete(cid);
        
        if (result.affected === 0) {
            throw new NotFoundException(`댓글 ID ${cid}를 찾을 수 없습니다`);
        }
    }
} 