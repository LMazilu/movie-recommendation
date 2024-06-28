import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * Checks if the user can activate the current route.
   *
   * @param {ExecutionContext} context - The execution context.
   * @return {Promise<boolean>} A promise that resolves to true if the user can activate the route, false otherwise.
   * @throws {UnauthorizedException} If no token is provided, the token is invalid, the user is not found, or the user is deleted.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(token);
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.userModel.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.isDeleted) {
      throw new UnauthorizedException('User is deleted');
    }

    // Set user in request for further use
    request.user = user;

    const isAdmin: boolean = this.reflector.get<boolean>(
      'isAdmin',
      context.getHandler(),
    );

    if (!isAdmin) {
      return true; // No roles required, grant access
    }

    if (isAdmin && user.isAdmin) {
      return true; // User is admin, grant access
    }

    return false; // Access denied
  }

  /**
   * Extracts a token from the authorization header of the request.
   *
   * @param {Request} request - the request object
   * @return {string | null} the extracted token or null if not found
   */
  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return null;
    }

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
