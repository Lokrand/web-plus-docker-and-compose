import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishListsController } from './wishlists.controller';
import { WishList } from './entities/wishlists.entity';
import { WishListsService } from './wishlists.service';
import { WishesModule } from 'src/wishes/wishes.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([WishList]), UsersModule, WishesModule],
  providers: [WishListsService],
  controllers: [WishListsController],
  exports: [WishListsService],
})
export class WishListsModule {}
