import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNumber } from 'class-validator';
import { User } from '../entities/users.entity';

export class FindManyUsersDto extends OmitType(CreateUserDto, [
  'email',
  'password',
]) {
  @IsNumber()
  id: number;

  static getUserObj(user: User): FindManyUsersDto {
    return {
      id: user.id,
      username: user.username,
      about: user.about,
      avatar: user.avatar,
    };
  }
}
