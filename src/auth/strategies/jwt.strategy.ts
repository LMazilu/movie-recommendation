import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Creates a new instance of the JwtStrategy class.
   *
   * @constructor
   * @param {Object} options - The options for the JwtStrategy.
   * @param {Function} options.jwtFromRequest - The function used to extract the JWT from the request.
   * @param {boolean} options.ignoreExpiration - Whether to ignore the expiration of the JWT.
   * @param {string} options.secretOrKey - The secret or key used to decode the JWT.
   */
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /**
   * Validates the payload and returns the userId and email.
   *
   * @param {any} payload - The payload to be validated.
   * @return {Promise<{ userId: string, email: string }>} - The userId and email extracted from the payload.
   */
  async validate(payload: any) {
    return payload;
  }
}
