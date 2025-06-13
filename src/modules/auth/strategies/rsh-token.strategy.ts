import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../models/token-payload.model';

@Injectable()
export class RshTokenStrategy extends PassportStrategy(Strategy, 'rsh-jwt') {
  constructor(private readonly configSer: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
      ignoreExpiration: false,
      secretOrKey: configSer.get<string>('config.jwt.rsh_secret'),
    });
  }

  validate(payload: TokenPayload) {
    return payload;
  }
}
