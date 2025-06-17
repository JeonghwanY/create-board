import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board.status.enum';
import {v1 as uuid} from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';
import { NotFoundError } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { Repository } from 'typeorm';
@Injectable()
export class BoardsService {//데이터베이스 작업
    constructor(
    @InjectRepository(Board)
        private readonly boardRepository: Repository<Board>,
    ) {}

    
    // private boards: Board[] = [];
    // getAllBoards(): Board[]{
    //     return this.boards;
    // }
    async createBoard(createBoardDto: CreateBoardDto): Promise<Board>{
        const {title, description} = createBoardDto;
        const board = this.boardRepository.create({
            title,
            description,
            status: BoardStatus.PUBLIC
        })
        await this.boardRepository.save(board);
        return board;
    }
    // createBoard(createBoardDto: CreateBoardDto){
    //     //const title = createBoardDto.title;
    //     const {title,description} = createBoardDto;
    //     const board : Board= {
    //         title,//두개가 동일하면 하나만 써도됨
    //         id : uuid(),
    //         description,
    //         status: BoardStatus.PUBLIC
    //     }
    //     this.boards.push(board);
    //     return board;
    // }
    async getBoardById(id: number): Promise <Board>{
        const found = await this.boardRepository.findOne({where: { id } });//id에 맞는 게시물 찾기

        if(!found) {
            throw new NotFoundException(`Can't find Board with id ${id}`);
        }
        return found;
    }
    // getBoardById(id: string): Board {
    //     const board = this.boards.find((board) => board.id === id);
    //     if (!board){
    //         throw new NotFoundException('Board with ID "${id}" not found');
    //     }
    //     return board;
    // }  
    async deleteBoard(id: number): Promise<void>{//리턴값은 promise(void)로 
        const result = await this.boardRepository.delete(id);
        if(result.affected === 0){
            throw new NotFoundException(`Can't find Board with id ${id}`)
        }
        //console.log('result',result);
    }
    // deleteBoard(id: string): void{
    //     const found = this.getBoardById(id);//없는 게시물을 지우려 할 때 결과 값 처리 . 지우려는 게시물이 있는지 체크하고 있으면 지우고 없으면 에러문구 등장
    //     this.boards = this.boards.filter((board) => board.id !== found.id)
    // }
    async updateBoardStatus(id: number, status: BoardStatus): Promise<Board>{
        const board = await this.getBoardById(id);

        board.status = status;
        await this.boardRepository.save(board);
        return board;
    }
    // updateBoardStatus(id: string, status: BoardStatus): Board{
    //     const board = this.getBoardById(id);
    //     board.status = status;
    //     return board;
    // }
    async getAllBoards(): Promise <Board[]> {
        return this.boardRepository.find();//모든 게시물을 가져오는거라 find안에 아무것도 안넣는다
    }
    
    
}
