import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../services/users.service';
import { firebaseApp } from 'src/auth/strategies/firebase-admin.config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Authenticates a user and returns a JWT token.
   *
   * @param {string} email - The email of the user.
   * @param {string} pass - The password of the user.
   * @returns {Promise<{ access_token: string }>} A promise that resolves to an object containing the JWT access token.
   * @throws {UnauthorizedException} If the credentials are invalid.
   */
  async login(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await this.usersService.validatePassword(
      email,
      pass,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      email: user.email,
      googleId: null,
      sub: user._id,
      isAdmin: user.isAdmin,
      isDeleted: user.isDeleted,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  /**
   * Authenticates a user using Google credentials and returns a JWT token.
   *
   * @param {string} token - The Google ID token.
   * @returns {Promise<{ access_token: string }>} A promise that resolves to an object containing the JWT access token.
   * @throws {NotFoundException} If the Google credentials are invalid.
   * @throws {UnauthorizedException} If the Google token is invalid.
   */
  async googleLogin(token: string) {
    try {
      const decodedToken = await firebaseApp.auth().verifyIdToken(token);
      const { uid, email } = decodedToken;
      if (!uid || !email) {
        throw new NotFoundException('Invalid google credentials.');
      }
      let user = await this.usersService.findOne(email);
      if (!user) {
        user = await this.usersService.createGoogleUser(
          email,
          uid,
          'N/A',
          false,
        );
      }

      const payload = {
        email: user.email,
        googleId: uid,
        sub: user._id,
        isAdmin: user.isAdmin,
        isDeleted: user.isDeleted,
      };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid Google token: ' + error.message);
    }
  }

  /**
   * Initiates the password reset process for a user.
   *
   * @param {string} email - The email of the user requesting a password reset.
   * @returns {Promise<void>} A promise that resolves when the password reset process is initiated.
   * @throws {NotFoundException} If the user is not found.
   */
  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.password = process.env.FORGOT_PASSWORD_BASE ?? '';
    await user.save();
  }

  /**
   * Changes the password for a user.
   *
   * @param {string} email - The email of the user.
   * @param {string} oldPassword - The current password of the user.
   * @param {string} newPassword - The new password to set.
   * @returns {Promise<void>} A promise that resolves when the password is successfully changed.
   * @throws {NotFoundException} If the user is not found.
   * @throws {UnauthorizedException} If the old password is incorrect.
   */
  async changePassword(
    email: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    user.password = newPassword;

    await user.save();
  }
}
