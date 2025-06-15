import { Injectable, NotFoundException } from '@nestjs/common';
import { Board, BoardStatus } from './board.model';
import {v1 as uuid} from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';
import { NotFoundError } from 'rxjs';
@Injectable()
export class BoardsService {//데이터베이스 작업
    private boards: Board[] = [];
    getAllBoards(): Board[]{
        return this.boards;
    }

    createBoard(createBoardDto: CreateBoardDto){
        //const title = createBoardDto.title;
        const {title,description} = createBoardDto;
        const board : Board= {
            title,//두개가 동일하면 하나만 써도됨
            id : uuid(),
            description,
            status: BoardStatus.PUBLIC
        }
        this.boards.push(board);
        return board;
    }

    getBoardById(id: string): Board {
        const board = this.boards.find((board) => board.id === id);
        if (!board){
            throw new NotFoundException('Board with ID "${id}" not found');
        }
        return board;
    }  

    deleteBoard(id: string): void{
        const found = this.getBoardById(id);//없는 게시물을 지우려 할 때 결과 값 처리 . 지우려는 게시물이 있는지 체크하고 있으면 지우고 없으면 에러문구 등장
        this.boards = this.boards.filter((board) => board.id !== found.id)
    }
    
    updateBoardStatus(id: string, status: BoardStatus): Board{
        const board = this.getBoardById(id);
        board.status = status;
        return board;
    }
}
