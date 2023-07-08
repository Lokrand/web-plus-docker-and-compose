import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOptionsOrder,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Wish } from './entities/wishes.entity';
import { FindManyUsersDto } from 'src/users/dto/find-many-users.dto';
import { CreateWishDto } from './dto/create-wish.dto';
import { User } from 'src/users/entities/users.entity';
import { UpdateWishDto } from './dto/update-wish.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
    private readonly usersService: UsersService,
  ) {}

  async create(owner: User, createWishDto: CreateWishDto) {
    const wish = await this.wishesRepository.save({
      ...createWishDto,
      owner: FindManyUsersDto.getUserObj(owner),
    });
    return wish;
  }

  async findAll(options?: any) {
    return this.wishesRepository.find(options);
  }

  async findOne(id: number) {
    const wish = await this.wishesRepository.findOne({
      relations: { owner: true, offers: true },
      where: { id },
    });

    if (!wish) {
      throw new NotFoundException('Подарок по указанному id не найден');
    }

    delete wish.owner.password;
    delete wish.owner.email;
    return wish;
  }

  async remove(id: number, userId: number) {
    const deletedWish = await this.findOne(id);

    if (!deletedWish) {
      throw new NotFoundException('Подарок по указанному id не найден');
    }
    if (deletedWish.owner.id !== userId) {
      throw new BadRequestException('Вы не можете удалять чужой подарок');
    }
    await this.wishesRepository.delete(id);
    return deletedWish;
  }

  async update(wishId: number, dto: UpdateWishDto, userId: number) {
    const currentWish = await this.wishesRepository.findOne({
      relations: { owner: true, offers: true },
      where: { id: wishId },
    });
    if (dto.price && currentWish.raised > 0) {
      throw new ForbiddenException(
        'Нельзя изменить стоимость, если кто-то уже скинулся на подарок',
      );
    }
    if (currentWish?.owner?.id !== userId || currentWish.offers.length) {
      throw new BadRequestException('У вас нет права для изменения');
    }

    await this.wishesRepository.update(wishId, dto);
    return await this.wishesRepository.findBy({ id: wishId });
  }

  async findTopOrLast(order: FindOptionsOrder<Wish>, limit: number) {
    const wishes = await this.wishesRepository.find({
      relations: { owner: true, offers: true },
      order: order,
      take: limit,
    });
    for (const wish of wishes) {
      delete wish.owner.email;
      delete wish.owner.password;
    }
    return wishes;
  }

  updateWishRaised(id: number, raised: number): Promise<UpdateResult> {
    return this.wishesRepository.update(id, { raised });
  }

  async findByOrder(order: FindOptionsOrder<Wish>, limit: number) {
    return await this.wishesRepository.find({
      relations: { owner: true },
      order: order,
      take: limit,
    });
  }

  async find(options: FindManyOptions<Wish>): Promise<Wish[]> {
    return this.wishesRepository.find(options);
  }

  async copy(id: number, user: User) {
    const currentWish = await this.wishesRepository.findOneBy({ id });
    const alreadyExist = (await this.wishesRepository.findOne({
      where: { owner: { id: user.id }, name: currentWish.name },
    }))
      ? true
      : false;
    if (alreadyExist)
      throw new ConflictException('У вас уже есть данный подарок');
    currentWish.owner = user;
    delete currentWish.id;
    delete currentWish.owner.password;
    delete currentWish.owner.email;
    return await this.wishesRepository.save(currentWish);
  }
}
