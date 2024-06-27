import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { UsersService } from './services/users.service';
import { INestApplication } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
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
    await usersService.createUser('admin@example.com', 'admin', 1);
  }

  const userExists = await usersService.findOne('user@example.com');
  if (!userExists) {
    await usersService.createUser('user@example.com', 'user', 0);
  }
}

bootstrap();
