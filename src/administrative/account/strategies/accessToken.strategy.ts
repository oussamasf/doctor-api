import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AdministrativeService } from '../administrative.service';
// Constants
import AUTH_GUARD from '../../../common/constants/authGuards';
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  AUTH_GUARD.ACCESS_TOKEN_BACKOFFICE,
) {
  constructor(private readonly administrativeService: AdministrativeService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET_BACKOFFICE,
    });
  }

  async validate(payload: { email: string }) {
    const user = await this.administrativeService.getUserByEmail(payload.email);
    if (!user?.refreshToken) throw new UnauthorizedException();
    return user;
  }
}
