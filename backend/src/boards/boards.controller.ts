import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { BoardsService } from './boards.service';
import {  BoardStatus } from './board.status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { Board } from './board.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';


@Controller('boards')
@UseGuards(AuthGuard())//컨트롤러 레벨로 접근
export class BoardsController {
    constructor(private boardsService: BoardsService){}

    @Post()
    @UsePipes(ValidationPipe)
    createBoard(@Body() CreateBoardDto: CreateBoardDto,
    @GetUser() user:User):Promise<Board>{
        return this.boardsService.createBoard(CreateBoardDto, user);
    }

    @Get('/:id')
    getBoardById(@Param('id') id:number) : Promise <Board> {//param으로 받아온 아이디를 리턴에 넣어줘서 db에서 findOne 메소드를 이용해서 원하는 게시물을 찾을 수 있다.
        return this.boardsService.getBoardById(id)
    }

    @Delete('/:id')//아이디 값 기반으로 싹 다 지움.
    //param으로 아이디 가져옴 , ParseIntPipe : 메소드로 오는 파라미터가 숫자로 잘 되어 오는지 확인.
    deleteBoard(@Param('id', ParseIntPipe) id): Promise<void>{//Promise -> 결과값은void 형이여야함
        return this.boardsService.deleteBoard(id);//서비스에 있는 deleteBoard(id)의 값을 리턴
    }

    @Patch('/:id/status')
    updateBoardStatus(
        @Param('id',ParseIntPipe) id: number,
        @Body('status',BoardStatusValidationPipe) status: BoardStatus
    ) {
        return this.boardsService.updateBoardStatus(id,status);
    }

    @Get()
    getAllBoard(
        @GetUser() user: User 
    ): Promise<Board[]> {//db에 있는 전체내용 가져옴
        return this.boardsService.getAllBoards(user);
    }
}
