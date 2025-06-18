import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Param, 
    ParseIntPipe, 
    Patch, 
    Post, 
    UsePipes, 
    ValidationPipe 
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './comment.entity';

@Controller('comments')
export class CommentsController {
    constructor(private commentsService: CommentsService) {}

    // 댓글 작성 API
    @Post()
    @UsePipes(ValidationPipe)
    createComment(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
        console.log('댓글 작성 요청 받음:', createCommentDto);
        return this.commentsService.createComment(createCommentDto);
    }

    // 특정 게시글의 댓글 조회 API
    @Get('/board/:pid')
    getCommentsByBoardId(@Param('pid', ParseIntPipe) pid: number): Promise<Comment[]> {
        return this.commentsService.getCommentsByBoardId(pid);
    }

    // 댓글 ID로 특정 댓글 조회 API
    @Get('/:cid')
    getCommentById(@Param('cid', ParseIntPipe) cid: number): Promise<Comment> {
        return this.commentsService.getCommentById(cid);
    }

    // 댓글 수정 API
    @Patch('/:cid')
    @UsePipes(ValidationPipe)
    updateComment(
        @Param('cid', ParseIntPipe) cid: number,
        @Body() updateCommentDto: UpdateCommentDto
    ): Promise<Comment> {
        return this.commentsService.updateComment(cid, updateCommentDto);
    }

    // 댓글 삭제 API
    @Delete('/:cid')
    deleteComment(@Param('cid', ParseIntPipe) cid: number): Promise<void> {
        return this.commentsService.deleteComment(cid);
    }
} 