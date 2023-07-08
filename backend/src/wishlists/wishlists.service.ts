import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { WishList } from './entities/wishlists.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { UsersService } from 'src/users/users.service';
import { CreateWishListDto } from './dto/create-wishlist.dto';
import { User } from 'src/users/entities/users.entity';
import { UpdateWishListDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishListsService {
  constructor(
    @InjectRepository(WishList)
    private readonly wishListsRepository: Repository<WishList>,
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    createWishlistDto: CreateWishListDto,
    user: User,
  ): Promise<WishList> {
    const wishes = await this.wishesService.find({
      where: { id: In(createWishlistDto.items || []) },
    });

    const wishList = this.wishListsRepository.create({
      ...createWishlistDto,
      owner: user,
      items: wishes,
    });
    delete wishList.owner.email;
    delete wishList.owner.password;
    return this.wishListsRepository.save(wishList);
  }

  async findAll(): Promise<WishList[]> {
    const wishLists = await this.wishListsRepository.find({
      relations: ['items', 'owner'],
    });
    for (const wishlist of wishLists) {
      delete wishlist.owner.email;
      delete wishlist.owner.password;
    }
    return wishLists;
  }

  async findOne(id: number): Promise<WishList> {
    const wishList = await this.wishListsRepository.findOne({
      where: { id },
      relations: ['items', 'owner'],
    });

    if (!wishList) {
      throw new NotFoundException('Список подарков по указанному id не найден');
    }

    delete wishList.owner.email;
    delete wishList.owner.password;

    return wishList;
  }

  async updateOne(
    wishListId: number,
    userId: number,
    updateWishlistDto: UpdateWishListDto,
  ) {
    const currentWishList = await this.wishListsRepository.findOne({
      where: { id: wishListId },
      relations: ['items', 'owner'],
    });
    const currentUser = await this.usersService.findOne(userId);

    if (!currentWishList) {
      throw new NotFoundException('Список подарков по указанному id не найден');
    }

    if (currentWishList.owner.id !== currentUser.id) {
      throw new ForbiddenException(
        'Вы не можете редактировать чужой список подарков',
      );
    }

    const wishes = await this.wishesService.find({
      where: { id: In(updateWishlistDto.items || []) },
    });

    const updatedWishlist = await {
      ...updateWishlistDto,
      id: wishListId,
      updatedAt: new Date(),
      items: wishes,
    };

    const changedWishlist = this.wishListsRepository.save(updatedWishlist);

    return changedWishlist;
  }

  async removeOne(id: number, userId: number): Promise<WishList> {
    const deletedWishList = await this.findOne(id);

    if (!deletedWishList) {
      throw new NotFoundException('Список подарков по указанному id не найден');
    }
    if (deletedWishList.owner.id !== userId) {
      throw new BadRequestException(
        'Вы не можете удалять чужой список подарков',
      );
    }
    await this.wishListsRepository.delete(id);

    return deletedWishList;
  }
}
