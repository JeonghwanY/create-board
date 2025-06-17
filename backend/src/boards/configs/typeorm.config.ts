import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Post } from "../../posts/post.entity";
import { User } from "../../auth/user.entity";
import { Comment } from "../../comments/comment.entity";

export const typeORMConfig : TypeOrmModuleOptions = {//type orm 모듈
    type: 'postgres',
    host: '3.36.112.202',
    port: 5432,
    username: 'postgres',
    password: '1234',
    database: 'board_app',
    entities: [Post, User, Comment], // 엔티티를 명시적으로 등록
    synchronize: true // true 값을 주면 애플리케이션을 다시 실행할 때 엔티티안에서 수정된 컬럼의 길이 타입 변경값등을 해당 테이블을 Drop한 후 재생성한다.
}