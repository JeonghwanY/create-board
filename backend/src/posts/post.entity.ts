import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { User } from "../auth/user.entity";

@Entity('posts')
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn()
    pid: number; // 게시글 ID

    @Column()
    title: string; // 게시글 제목

    @Column('text')
    detail: string; // 게시글 내용

    @CreateDateColumn({ type: 'timestamp' })
    date: Date; // 작성 시간

    @Column({ nullable: true })
    picture: string; // 이미지 경로 (선택)

    // 관계 설정
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user: User;
} 
// @Column()
//     writer: string; // 게시글 작성자 (User의 username을 참조)
