import {
  Controller,
  Post,
  Req,
  Body,
  BadRequestException,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LocalGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  @HttpCode(200)
  signin(@Req() req): { access_token: string } {
    return this.authService.auth(req.user);
  }

  @Post('signup')
  async signup(@Body() dto: CreateUserDto) {
    const findUserByEmail = await this.usersService.findUserByEmail(dto.email);
    if (findUserByEmail) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }
    const findUserByUsername = await this.usersService.findUserByUsername(
      dto.username,
    );
    if (findUserByUsername) {
      throw new BadRequestException(
        'Пользователь с таким именем уже существует',
      );
    }
    const user = await this.usersService.create(dto);
    delete user.password;
    return user;
  }
}
