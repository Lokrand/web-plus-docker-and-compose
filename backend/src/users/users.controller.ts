import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Delete,
  Param,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { IGetMe } from './users.types';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private usersService: UsersService) {}

  // get all users
  @Get()
  async getAll() {
    const users = await this.usersService.findAll();
    for (const user of users) {
      delete user.password;
    }
    return users;
  }

  // get me
  @Get('me')
  async getMe(@Req() req: IGetMe) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } =
      await this.usersService.findOne(req.user.id);
    return userWithoutPassword;
  }

  // update me
  @Patch('me')
  async updateMe(@Req() req: IGetMe, @Body() body: UpdateUserDto) {
    await this.usersService.updateUserData(+req.user.id, body);
    return this.getMe(req);
  }

  // get my Wishes
  @Get('me/wishes')
  async getMyWishes(@Req() req: IGetMe) {
    const currentUser = await this.usersService.findUsersWithWishes(
      req.user.id,
    );
    const wishes = currentUser.map((user) => user.wishes);

    return wishes[0];
  }

  // get user by username
  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.getUserByUsername(username);
  }

  // get user's wishes
  @Get('/:username/wishes')
  async getUserWishes(@Param('username') username: string) {
    const wishes = await this.usersService.getUserWishes(username);
    return wishes;
  }

  // remove user by id
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);
    if (!user) {
      return new NotFoundException('Пользователь по указанному id не найден');
    }
    return this.usersService.remove(+id);
  }

  // find users bu username or email
  @Post('find')
  findUsers(@Body('query') query: string) {
    return this.usersService.findMany(query);
  }
}
