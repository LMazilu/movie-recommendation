import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../services/users.service';
import { User } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validates a user's email and password by comparing it with the stored user's password.
   *
   * @param {string} email - The email of the user.
   * @param {string} pass - The password of the user.
   * @return {Promise<Omit<User, 'password'> | null>} A promise that resolves to the user object without the password field
   */
  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findOne(email);
    if (user && (await this.usersService.validatePassword(email, pass))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Generates an access token for the given user.
   *
   * @param {Omit<User, 'password'>} user - The user object without the password field.
   * @return {Promise<{ access_token: string }>} - A promise that resolves to an object containing the access token.
   */
  async login(user: Omit<User, 'password'>) {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
