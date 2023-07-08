import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from 'src/utils/hashPassword';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindManyUsersDto } from './dto/find-many-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<User> {
    const deletedUser = await this.findOne(id);
    await this.usersRepository.delete(id);
    delete deletedUser.password;
    return deletedUser;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const { password, ...user } = dto;
    const hashedPassword = await hashPassword(password);
    return this.usersRepository.save({ password: hashedPassword, ...user });
  }

  async getUserWishes(name: string) {
    const user = await this.usersRepository.findOne({
      where: { username: name },
      relations: { wishes: true },
    });
    if (!user) {
      return new NotFoundException('Пользователь не найден');
    }
    if (user.wishes.length === 0) {
      return new NotFoundException(
        `Список подарков пользователя ${user.username} пуст`,
      );
    }
    return user.wishes;
  }

  async getUserByUsername(username: string): Promise<FindManyUsersDto> {
    const user = await this.usersRepository.findOneBy({ username });
    if (!user) {
      throw new NotFoundException(
        `Пользователь ${username} не найден в базе данных`,
      );
    }
    delete user.password;
    delete user.email;
    return user;
  }

  async findMany(query: string): Promise<any[]> {
    const users = await this.usersRepository.find({
      where: [{ email: Like(`%${query}%`) }, { username: Like(`%${query}%`) }],
    });
    for (const user of users) {
      delete user.password;
    }
    return users;
  }

  async updateUserData(id: number, dto: UpdateUserDto) {
    if (dto.email) {
      const findUserByEmail = await this.findUserByEmail(dto.email);
      if (findUserByEmail) {
        throw new BadRequestException(
          'Пользователь с таким email уже существует',
        );
      }
    }
    if (dto.username) {
      const findUserByUsername = await this.findUserByUsername(dto.username);
      if (findUserByUsername) {
        throw new BadRequestException(
          'Пользователь с таким именем уже существует',
        );
      }
    }
    const { password } = dto;
    if (password) {
      return this.usersRepository.update(id, {
        ...dto,
        password: await hashPassword(password),
      });
    } else return this.usersRepository.update(id, dto);
  }

  findUserByUsername(username: string): Promise<User> {
    return this.usersRepository.findOneBy({ username });
  }

  findUserByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }

  async findUsersWithWishes(id: number) {
    const currentUser = await this.usersRepository.find({
      relations: { wishes: true },
      where: { id },
    });
    if (!currentUser) {
      throw new NotFoundException('У вас еще нет ни одного подарка');
    }
    return currentUser;
  }
}
