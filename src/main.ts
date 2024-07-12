import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./src/dintegrasi-cert/privkey.pem'),
    cert: fs.readFileSync('./src/dintegrasi-cert/fullchain.pem'),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  await app.listen(5174);
}
bootstrap();
