import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HashingService } from 'src/providers/hashing.service';
import { BcryptService } from 'src/providers/bcrypt.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AccTokenStrategy } from './strategies/acc-token.strategy';
import { RshTokenStrategy } from './strategies/rsh-token.strategy';
import { LogoutStrategy } from './strategies/logout.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configSer: ConfigService) => ({
        secret: configSer.get<string>('config.jwt.acc_secret'),
        signOptions: {
          expiresIn: configSer.get<string>('config.jwt.acc_expires'),
        },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    LocalStrategy,
    AccTokenStrategy,
    RshTokenStrategy,
    LogoutStrategy,
  ],
})
export class AuthModule {}
