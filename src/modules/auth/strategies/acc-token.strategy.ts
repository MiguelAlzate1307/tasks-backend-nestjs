import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../models/token-payload.model';

@Injectable()
export class AccTokenStrategy extends PassportStrategy(Strategy, 'acc-jwt') {
  constructor(private readonly configSer: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configSer.get<string>('config.jwt.acc_secret'),
    });
  }

  validate(payload: TokenPayload) {
    return payload;
  }
}
