import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { UsersService } from '../services/users.service';
import { JwtService } from '@nestjs/jwt';
import { Request as ExpressRequest } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  /**
   * Logs in a user.
   *
   * @param {ExpressRequest} req - The Express request object.
   * @return {Promise<any>} A promise that resolves to the login response.
   * @throws {UnauthorizedException} If the user credentials are invalid.
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: ExpressRequest) {
    const user = await this.authService.validateUser(
      req.body.email,
      req.body.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid user credentials');
    }
    return this.authService.login(user);
  }

  /**
   * Registers a new user with the given email and password.
   *
   * @param {Object} body - The request body containing the email and password.
   * @param {string} body.email - The email address of the user.
   * @param {string} body.password - The password of the user.
   * @return {Promise<User>} A promise that resolves to the created user.
   */
  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    return this.usersService.createUser(body.email, body.password, 0);
  }
}
