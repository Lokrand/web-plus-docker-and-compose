import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entities/wishes.entity';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Wish]), UsersModule],
  providers: [WishesService],
  controllers: [WishesController],
  exports: [WishesService],
})
export class WishesModule {}
