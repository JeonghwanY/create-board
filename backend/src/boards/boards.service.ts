import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board.status.enum';
import {v1 as uuid} from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';
import { NotFoundError } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';
@Injectable()
export class BoardsService {//데이터베이스 작업
    constructor(
    @InjectRepository(Board)
        private readonly boardRepository: Repository<Board>,
    ) {}

    async createBoard(createBoardDto: CreateBoardDto,user : User): Promise<Board>{
        const {title, description} = createBoardDto;
        const board = this.boardRepository.create({
            title,
            description,
            status: BoardStatus.PUBLIC,
            user//게시물 생성할때 유저정보 넣어주기
        })
        await this.boardRepository.save(board);
        return board;
    }

    async getBoardById(id: number): Promise <Board>{
        const found = await this.boardRepository.findOne({where: { id } });//id에 맞는 게시물 찾기

        if(!found) {
            throw new NotFoundException(`Can't find Board with id ${id}`);
        }
        return found;
    }
 
    async deleteBoard(id: number): Promise<void>{//리턴값은 promise(void)로 
        const result = await this.boardRepository.delete(id);
        if(result.affected === 0){
            throw new NotFoundException(`Can't find Board with id ${id}`)
        }
    }

    async updateBoardStatus(id: number, status: BoardStatus): Promise<Board>{
        const board = await this.getBoardById(id);

        board.status = status;
        await this.boardRepository.save(board);
        return board;
    }

    async getAllBoards(//본인, 한 유저의 게시물만 가져오기
        user: User
    ): Promise <Board[]> {
        const query = this.boardRepository.createQueryBuilder('board');

        query.where('board.userId = :userId', { userId: user.id});

        const boards = await query.getMany();

        return boards;

        //return this.boardRepository.find();//모든 게시물을 가져오는거라 find안에 아무것도 안넣는다
    }
}
