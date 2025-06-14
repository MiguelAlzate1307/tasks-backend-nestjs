import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { HashingService } from 'src/providers/hashing.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RolesEnum } from '../users/enums/roles.enum';
import { TokenPayload } from './models/token-payload.model';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersSer: UsersService,
    private readonly hashSer: HashingService,
    private readonly jwtSer: JwtService,
    private readonly configSer: ConfigService,
  ) {}

  async login({ email, password }: LoginDto) {
    const userFound = await this.usersSer.findOneByEmail(email);

    if (!userFound) throw new NotFoundException('User not found');

    const isMatch = await this.hashSer.compare(password, userFound.password);

    if (!isMatch) throw new ForbiddenException('Access Denied');

    const { password: pass, refresh_token, ...user } = userFound;

    return user;
  }

  async generateJwts(user: User) {
    const tokens = await this.getTokens(user.id, user.role);

    return {
      ok: true,
      ...tokens,
      user,
    };
  }

  async register(registerDto: CreateUserDto) {
    const { user } = await this.usersSer.create(registerDto);

    const tokens = await this.getTokens(user.id, user.role);

    return {
      ok: true,
      ...tokens,
      user,
    };
  }

  async refresh_token({ id, role }: TokenPayload, refresh_token: string) {
    const { user: userFound } = await this.usersSer.findOne(id, [], {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      refresh_token: true,
      created_at: true,
      updated_at: true,
      deleted_at: true,
    });

    if (!userFound.refresh_token)
      throw new UnauthorizedException('Session is no longer active');

    const isMatch = this.hashSer.compareTokens(
      refresh_token,
      userFound.refresh_token,
    );

    if (!isMatch) {
      await this.logout({ id, role });
      throw new UnauthorizedException('Access Denied');
    }

    const tokens = await this.getTokens(userFound.id, userFound.role);

    const { refresh_token: rsh_token, ...user } = userFound;

    return {
      ok: true,
      ...tokens,
      user,
    };
  }

  async logout({ id }: TokenPayload) {
    await this.usersSer.findOne(id);

    await this.usersSer.update(id, { refresh_token: null });

    return {
      ok: true,
      message: 'User logged out successfully',
    };
  }

  async profile({ id }: TokenPayload) {
    const { user } = await this.usersSer.findOne(id);

    return {
      ok: true,
      user,
    };
  }

  private async getTokens(id: string, role: RolesEnum) {
    const payload: TokenPayload = { id, role };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtSer.signAsync(payload),
      this.jwtSer.signAsync(payload, {
        secret: this.configSer.get<string>('config.jwt.rsh_secret'),
        expiresIn: this.configSer.get<string>('config.jwt.rsh_expires'),
      }),
    ]);

    await this.usersSer.update(id, { refresh_token });

    return {
      access_token,
      refresh_token,
    };
  }
}
