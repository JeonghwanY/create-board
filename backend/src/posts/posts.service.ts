import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
    ) {}

    // 게시글 작성
    async createPost(
        createPostDto: CreatePostDto,
        user: User, // ← 로그인된 유저를 추가로 받음
        picture?: string | null
    ): Promise<Post> {
        const { title, detail } = createPostDto;

        const post = this.postRepository.create({
        title,
        detail,
        user, // ← 실제 유저 인스턴스
        picture: picture
    } as Partial<Post>
);

    await this.postRepository.save(post);
    return post;
    }

    // 게시글 목록 조회 (무한 스크롤용 - offset 방식)
    async getPosts(page: number = 1, limit: number = 10): Promise<{ posts: Post[], total: number, hasMore: boolean }> {
        const offset = (page - 1) * limit;
        
        const [posts, total] = await this.postRepository.findAndCount({
            order: { date: 'DESC' }, // 최신순으로 정렬
            skip: offset,
            take: limit,
        });

        const hasMore = offset + limit < total;

        return {
            posts,
            total,
            hasMore
        };
    }

    // 게시글 상세 조회
    async getPostById(pid: number): Promise<Post> {
        const post = await this.postRepository.findOne({
            where: { pid }
        });

        if (!post) {
            throw new NotFoundException(`게시글 ID ${pid}를 찾을 수 없습니다`);
        }

        return post;
    }

    // 게시글 수정 (작성자 검증 포함)
    async updatePost(pid: number, updatePostDto: UpdatePostDto, requestWriter: string, picture?: string | null): Promise<Post> {
        const post = await this.getPostById(pid);
        
        // 작성자 검증: 요청자가 게시글 작성자와 일치하는지 확인
        if (post.user.username !== requestWriter) {
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
        const post = await this.getPostById(pid);
        
        // 작성자 검증: 요청자가 게시글 작성자와 일치하는지 확인
        if (post.user.username !== requestWriter) {
            throw new ForbiddenException('자신이 작성한 게시글만 삭제할 수 있습니다');
        }
        
        const result = await this.postRepository.delete(pid);
        
        if (result.affected === 0) {
            throw new NotFoundException(`게시글 ID ${pid}를 찾을 수 없습니다`);
        }
    }
} 