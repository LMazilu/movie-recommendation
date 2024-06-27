import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3030;
  app.listen(port, () => {
    console.log(`Server successfully started on port ${port}`);
  });
}
bootstrap();
