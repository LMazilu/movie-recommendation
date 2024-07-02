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

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.password = process.env.FORGOT_PASSWORD_BASE ?? '';
    await user.save();
  }

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
