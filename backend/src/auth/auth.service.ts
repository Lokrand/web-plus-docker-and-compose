import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/entities/users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  auth(user: User): { access_token: string } {
    const payload = { sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findUserByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Неверное имя пользователя или пароль');
    }
    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      throw new UnauthorizedException('Неверное имя пользователя или пароль');
    }

    if (user && comparePassword) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...res } = user;

      return res;
    }

    return null;
  }
}
