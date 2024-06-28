import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { UsersService } from './services/users.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  dotenv.config();
  //Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Movie Recommendation API')
    .setDescription('The movie recommendation API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  // Security settings
  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  //Add user and admin and then start the app
  await createBasicUsers(app);
  const port = process.env.PORT ?? 3030;
  app.listen(port, () => {
    console.log(`Server successfully started on port ${port}`);
  });
}

/**
 * Creates basic users with the given email and password.
 *
 * @param {INestApplication<any>} app - The Nest application.
 * @return {Promise<void>} A promise that resolves when the basic users are created.
 */
async function createBasicUsers(app: INestApplication<any>) {
  const usersService = app.get(UsersService);

  const adminExists = await usersService.findOne('admin@example.com');
  if (!adminExists) {
    await usersService.createUser('admin@example.com', 'admin', true);
  }

  const userExists = await usersService.findOne('user@example.com');
  if (!userExists) {
    await usersService.createUser('user@example.com', 'user', false);
  }
}

bootstrap();
