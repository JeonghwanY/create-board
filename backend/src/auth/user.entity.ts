import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()//이 클래스가 entity로 지정시키기 위해서
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;
}