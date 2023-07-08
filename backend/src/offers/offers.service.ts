import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offers.entity';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { User } from 'src/users/entities/users.entity';
import { FindManyUsersDto } from 'src/users/dto/find-many-users.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  async create(dto: CreateOfferDto, user: User): Promise<Offer> {
    const currentUser = await this.usersService.findOne(user.id);
    const currentWish = await this.wishesService.findOne(dto.id);

    if (!currentUser)
      throw new NotFoundException('Пользователь по указанномму id не найден');
    delete currentUser.password;

    if (!currentWish)
      throw new NotFoundException('Подарок по указанному id не найден');
    if (currentWish.owner.id === currentUser.id) {
      throw new BadRequestException(
        'Вы не можете скинуться на собственный подарок',
      );
    }

    const raised = +(+currentWish.raised + dto.amount).toFixed(2);

    if (raised > currentWish.price) {
      throw new BadRequestException(
        `Сумма подарка превышена, уменьшите сумма на ${
          raised - currentWish.price
        }`,
      );
    }

    await this.wishesService.updateWishRaised(currentWish.id, raised);

    const newOffer = this.offersRepository.create({
      ...dto,
      user: currentUser,
      item: currentWish,
    });
    const savedOffer = this.offersRepository.save(newOffer);
    return savedOffer;
  }

  async findAll(): Promise<any[]> {
    const offers = await this.offersRepository.find({
      relations: ['item', 'user'],
    });

    if (!offers) {
      throw new NotFoundException('Офферы не найдены');
    }

    const findedOffers = offers.map((offer) => {
      return { ...offer, user: FindManyUsersDto.getUserObj(offer.user) };
    });

    return findedOffers;
  }

  async findOne(id: number): Promise<any> {
    const offer = await this.offersRepository.findOne({
      where: { id },
      relations: ['item', 'user'],
    });

    if (!offer) {
      throw new NotFoundException('Оффер не найден');
    }

    return { ...offer, user: FindManyUsersDto.getUserObj(offer.user) };
  }
}
