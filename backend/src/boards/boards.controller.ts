import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { BoardsService } from './boards.service';
import {  BoardStatus } from './board.status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { Board } from './board.entity';

@Controller('boards')
export class BoardsController {
    constructor(private boardsService: BoardsService){}


    // @Get()
    // getAllBoard(): Board[]{
    //     return this.boardsService.getAllBoards();
    // }
    // @Post()//response
    // @UsePipes(ValidationPipe)
    // createBoard(
    //     @Body() createBoardDto: CreateBoardDto
    // ): Board{
    //     return this.boardsService.createBoard(createBoardDto);    
    // }

    @Post()
    @UsePipes(ValidationPipe)
    createBoard(@Body() CreateBoardDto: CreateBoardDto):Promise<Board>{
        return this.boardsService.createBoard(CreateBoardDto);
    }



    @Get('/:id')
    getBoardById(@Param('id') id:number) : Promise <Board> {//param으로 받아온 아이디를 리턴에 넣어줘서 db에서 findOne 메소드를 이용해서 원하는 게시물을 찾을 수 있다.
        return this.boardsService.getBoardById(id)
    }
    // @Get('/:id')
    // getBoardById(@Param('id') id: string): Board {
    //     return this.boardsService.getBoardById(id)
    // }

    // @Delete('/:id')
    // deleteBoard(@Param('id') id: string): void{
    //     this.boardsService.deleteBoard(id);
    // }

    // @Patch('/:id/status')
    // updateBoardStatus(
    //     @Param('id') id: string,
    //     @Body('status',BoardStatusValidationPipe) status: BoardStatus
    // ) {
    //     return this.boardsService.updateBoardStatus(id,status);
    // }

    // @Get(':id')
    // findOne(@Param('id',ParseIntPipe) id: number){
    //     return ;
    // }
}
