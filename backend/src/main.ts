import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 정적 파일 서빙 설정 (업로드된 이미지 접근용)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // main.ts (NestJS)
  app.enableCors({
    origin: 'http://13.125.214.63:5173',
    credentials: true,
  });

  // await app.listen(process.env.PORT ?? 3000);
  await app.listen(3000, '0.0.0.0')
}
bootstrap();
