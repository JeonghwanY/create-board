import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()//이 클래스가 entity로 지정시키기 위해서
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    username: string;

    @Column()
    password: string;
}