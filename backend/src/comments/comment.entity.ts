import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Board } from "../boards/board.entity";
import { User } from "../auth/user.entity";

@Entity()
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    cid: number;

    @Column()
    pid: number; // 게시글 ID (Board의 id를 참조)

    @Column('text')
    c_detail: string; // 댓글 내용

    @CreateDateColumn({ type: 'timestamp' })
    c_date: Date; // 댓글 작성 시간

    @Column()
    c_writer: string; // 댓글 작성자 (User의 username을 참조)

    // 관계 설정
    @ManyToOne(() => Board, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'pid' })
    board: Board;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'c_writer', referencedColumnName: 'username' })
    user: User;
} 