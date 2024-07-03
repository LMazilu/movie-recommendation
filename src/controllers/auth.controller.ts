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

  /**
   * Logs in a user with a google account.
   * We get a googleId token and then transform it into our jwt and return it to the user.
   *
   * @param {ExpressRequest} token - The Express request object.
   * @return {Promise<any>} A promise that resolves to the login response.
   * @throws {UnauthorizedException} If the user credentials are invalid.
   */
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

  /**
   * Sends a password reset request to the user with the given email.
   *
   * @param {Object} body - The request body containing the user's email.
   * @param {string} body.email - The email address of the user.
   * @return {Promise<void>} A promise that resolves when the password reset request is sent.
   */
  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }): Promise<void> {
    return this.authService.forgotPassword(body.email);
  }

  /**
   * Changes the password of a user.
   *
   * @param {Object} body - The request body containing the user's email, old password, and new password.
   * @param {string} body.email - The email address of the user.
   * @param {string} body.oldPassword - The current password of the user.
   * @param {string} body.newPassword - The new password of the user.
   * @return {Promise<void>} A Promise that resolves when the password is successfully changed.
   */
  @Post('change-password')
  async changePassword(
    @Body() body: { email: string; oldPassword: string; newPassword: string },
  ): Promise<void> {
    return this.authService.changePassword(
      body.email,
      body.oldPassword,
      body.newPassword,
    );
  }
}
