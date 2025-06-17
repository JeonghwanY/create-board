import { Board } from "src/boards/board.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()//이 클래스가 entity로 지정시키기 위해서
//@Unique(['username','email'])//username이 유니크한 값을 가지게 된다
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})//이게 유니크한 값을 주는 것 unique: true
    email: string;

    @Column({unique: true})
    username: string;

    @Column()
    password: string;

    @OneToMany(type => Board, board => board.user, { eager: true})
    boards: Board[]
}