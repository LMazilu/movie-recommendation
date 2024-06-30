import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { Request as ExpressRequest } from 'express';
import { AuthDTO } from 'src/DTOs/AuthDTO.dto';

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
  @Post('login')
  async login(@Body() req: AuthDTO) {
    return this.authService.login(req.email, req.password);
  }

  @Post('google-login')
  async googleLogin(@Body('token') token: string) {
    return this.authService.googleLogin(token);
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
    return this.usersService.createUser(body.email, body.password, false);
  }
}
