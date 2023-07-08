import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/users.entity';
import { AuthModule } from './auth/auth.module';
import { Wish } from './wishes/entities/wishes.entity';
import { WishList } from './wishlists/entities/wishlists.entity';
import { Offer } from './offers/entities/offers.entity';
import { OffersModule } from './offers/offers.module';
import { WishesModule } from './wishes/wishes.module';
import { WishListsModule } from './wishlists/wishlists.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    OffersModule,
    WishesModule,
    WishListsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'DP25cos454345',
      database: 'kupipodariday',
      entities: [User, Wish, WishList, Offer],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
