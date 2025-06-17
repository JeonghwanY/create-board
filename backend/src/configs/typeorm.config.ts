import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeORMConfig : TypeOrmModuleOptions = {//type orm 모듈
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'board_app',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],//엔티티를 이용해서 데이테베이스 테이블을 생성해 엔티티파일이 어디에 있는지 설정해준다
    synchronize: true // true 값을 주면 애플리케이션을 다시 실행할 때 엔티티안에서 수정된 컬럼의 길이 타입 변경값등을 해당 테이블을 Drop한 후 재생성한다.
}