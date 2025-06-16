import { BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";
import { BoardStatus } from "./board.model";

export class Board extends BaseEntity{//nest.js 어플리케이선을 실행할 때 자동적으로 아래 칼럼들을 가진 보드 테이블들이 자동적으로 생성이 된다.
    @PrimaryGeneratedColumn()//모드 엔티티의 기본키임을 알려주기 위한 코드
    id: number;

    @Column()
    title:string;

    @Column()
    description: string;

    @Column()
    status: BoardStatus;

}