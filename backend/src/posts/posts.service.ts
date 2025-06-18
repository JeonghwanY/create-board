import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
    ) {}

    // 게시글 작성
    async createPost(
        createPostDto: CreatePostDto,
        writer: string,
        picture?: string | null
    ): Promise<Post> {
        const { title, detail } = createPostDto;

        const post = this.postRepository.create({
            title,
            detail,
            writer: writer,
            picture: picture || undefined
        });

        await this.postRepository.save(post);
        return post;
    }

    // 게시글 목록 조회 (무한 스크롤용 - offset 방식)
    async getPosts(page: number = 1, limit: number = 10): Promise<{ posts: any[], total: number, hasMore: boolean }> {
        const offset = (page - 1) * limit;
        
        const [posts, total] = await this.postRepository.findAndCount({
            order: { date: 'DESC' }, // 최신순으로 정렬
            skip: offset,
            take: limit,
        });

        // 한국 시간대로 변환된 게시글 정보 추가
        const postsWithKoreanTime = posts.map(post => ({
            pid: post.pid,
            title: post.title,
            detail: post.detail,
            date: post.date,
            picture: post.picture,
            writer: post.writer,
            koreanTime: this.convertToKoreanTime(post.date),
        }));

        const hasMore = offset + limit < total;

        return {
            posts: postsWithKoreanTime,
            total,
            hasMore
        };
    }

    // 게시글 상세 조회
    async getPostById(pid: number): Promise<any> {
        const post = await this.postRepository.findOne({
            where: { pid }
        });

        if (!post) {
            throw new NotFoundException(`게시글 ID ${pid}를 찾을 수 없습니다`);
        }

        // 한국 시간대 정보 추가
        return {
            pid: post.pid,
            title: post.title,
            detail: post.detail,
            date: post.date,
            picture: post.picture,
            writer: post.writer,
            koreanTime: this.convertToKoreanTime(post.date),
        };
    }

    // UTC 시간을 한국 시간으로 변환
    private convertToKoreanTime(utcDate: Date): string {
        const koreanTime = new Date(utcDate);
        koreanTime.setHours(koreanTime.getHours() + 9); // UTC + 9시간 = 한국 시간
        
        return koreanTime.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    }

    // 게시글 수정 (작성자 검증 포함)
    async updatePost(pid: number, updatePostDto: UpdatePostDto, requestWriter: string, picture?: string | null): Promise<Post> {
        const post = await this.postRepository.findOne({
            where: { pid }
        });
        
        if (!post) {
            throw new NotFoundException(`게시글 ID ${pid}를 찾을 수 없습니다`);
        }

        // 작성자 검증: 요청자가 게시글 작성자와 일치하는지 확인
        if (post.writer !== requestWriter) {
            throw new ForbiddenException('자신이 작성한 게시글만 수정할 수 있습니다');
        }
        
        if (updatePostDto.title) {
            post.title = updatePostDto.title;
        }
        
        if (updatePostDto.detail) {
            post.detail = updatePostDto.detail;
        }
        
        if (picture) {
            post.picture = picture;
        }

        await this.postRepository.save(post);
        return post;
    }

    // 게시글 삭제 (작성자 검증 포함)
    async deletePost(pid: number, requestWriter: string): Promise<void> {
        const post = await this.postRepository.findOne({
            where: { pid }
        });
        
        if (!post) {
            throw new NotFoundException(`게시글 ID ${pid}를 찾을 수 없습니다`);
        }

        // 작성자 검증: 요청자가 게시글 작성자와 일치하는지 확인
        if (post.writer !== requestWriter) {
            throw new ForbiddenException('자신이 작성한 게시글만 삭제할 수 있습니다');
        }
        
        const result = await this.postRepository.delete(pid);
        
        if (result.affected === 0) {
            throw new NotFoundException(`게시글 ID ${pid}를 찾을 수 없습니다`);
        }
    }
} 