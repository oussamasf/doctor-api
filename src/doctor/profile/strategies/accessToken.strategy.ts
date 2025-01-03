import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { DoctorProfileService } from '../doctor.profile.service';
// Constants
import AUTH_GUARD from '../../../common/constants/authGuards';
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  AUTH_GUARD.ACCESS_TOKEN_DOCTOR,
) {
  constructor(private readonly doctorAuthService: DoctorProfileService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET_CLIENT,
    });
  }

  async validate(payload: { username: string }) {
    const user = await this.doctorAuthService.getUserByName(payload.username);
    if (!user.refreshToken) throw new UnauthorizedException();
    return user;
  }
}
