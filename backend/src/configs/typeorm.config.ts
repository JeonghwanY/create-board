import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "src/auth/user.entity";
import { Comment } from "src/comments/comment.entity";
import { Post } from "src/posts/post.entity";

export const typeORMConfig : TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_DATABASE || 'board_app',
    entities: [Post, User, Comment],
    synchronize: true,
    dropSchema: true,
    ssl: false,
    connectTimeoutMS: 60000,
    extra: {
        connectionLimit: 10,
        acquireTimeoutMillis: 60000,
        timeout: 60000,
    },
    logging: true
}