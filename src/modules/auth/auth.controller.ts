import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/global/decorators/public.decorator';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RshTokenGuard } from './guards/rsh-token.guard';
import { TokenPayload } from './models/token-payload.model';
import { LogoutGuard } from './guards/logout.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalGuard)
  @Post('login')
  login(@Req() req: Request) {
    return this.authService.generateJwts(req.user as User);
  }

  @Public()
  @Post('register')
  register(@Body() registerDto: CreateUserDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @UseGuards(RshTokenGuard)
  @Post('refresh-token')
  refresh_token(
    @Req() req: Request,
    @Body('refresh_token') refresh_token: string,
  ) {
    return this.authService.refresh_token(
      req.user as TokenPayload,
      refresh_token,
    );
  }

  @Public()
  @UseGuards(LogoutGuard)
  @Post('logout')
  logout(@Req() req: Request) {
    return this.authService.logout(req.user as TokenPayload);
  }

  @Get('profile')
  profile(@Req() req: Request) {
    return this.authService.profile(req.user as TokenPayload);
  }
}
