import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Param, 
    ParseIntPipe, 
    Patch, 
    Post as HttpPost, 
    Query,
    UploadedFile, 
    UseInterceptors, 
    UsePipes, 
    ValidationPipe 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './post.entity';

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) {}

    // 게시글 작성 API (이미지 선택적 업로드)
    @HttpPost()
    @UsePipes(ValidationPipe)
    @UseInterceptors(FileInterceptor('picture', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = extname(file.originalname);
                callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return callback(new Error('이미지 파일만 업로드 가능합니다!'), false);
            }
            callback(null, true);
        },
        limits: {
            fileSize: 1024 * 1024 * 5, // 5MB 제한
        },
    }))
    async createPost(
        @Body() createPostDto: CreatePostDto,
        @UploadedFile() file?: Express.Multer.File
    ): Promise<Post> {
        const picturePath = file ? `/uploads/${file.filename}` : null;
        return this.postsService.createPost(createPostDto, picturePath);
    }

    // 게시글 목록 조회 API (무한 스크롤용)
    @Get()
    async getPosts(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ): Promise<{ posts: Post[], total: number, hasMore: boolean }> {
        return this.postsService.getPosts(page, limit);
    }

    // 게시글 상세 조회 API
    @Get('/:pid')
    async getPostById(@Param('pid', ParseIntPipe) pid: number): Promise<Post> {
        return this.postsService.getPostById(pid);
    }

    // 게시글 수정 API (이미지 업로드 포함, 작성자 검증)
    @Patch('/:pid')
    @UsePipes(ValidationPipe)
    @UseInterceptors(FileInterceptor('picture', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = extname(file.originalname);
                callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return callback(new Error('이미지 파일만 업로드 가능합니다!'), false);
            }
            callback(null, true);
        },
        limits: {
            fileSize: 1024 * 1024 * 5, // 5MB 제한
        },
    }))
    async updatePost(
        @Param('pid', ParseIntPipe) pid: number,
        @Body() updatePostDto: UpdatePostDto,
        @Body('writer') writer: string, // 작성자 검증을 위한 필드 추가
        @UploadedFile() file?: Express.Multer.File
    ): Promise<Post> {
        const picturePath = file ? `/uploads/${file.filename}` : null;
        return this.postsService.updatePost(pid, updatePostDto, writer, picturePath);
    }

    // 게시글 삭제 API (작성자 검증)
    @Delete('/:pid')
    async deletePost(
        @Param('pid', ParseIntPipe) pid: number,
        @Body('writer') writer: string // 작성자 검증을 위한 필드 추가
    ): Promise<void> {
        return this.postsService.deletePost(pid, writer);
    }
} 