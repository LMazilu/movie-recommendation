import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth.module';
import { UsersModule } from './users.module';
import { RecommendationsModule } from './recommendation.module';
import { ConfigModule } from '@nestjs/config';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI ?? ''),
    AuthModule,
    UsersModule,
    RecommendationsModule,
  ],
  providers: [RolesGuard, JwtService],
})
export class AppModule {}
