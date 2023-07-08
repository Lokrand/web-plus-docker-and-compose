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
      // url: 'postgresql://db:5444',
      type: 'postgres',
      host: 'db',
      // host: 'db',
      port: 5432,
      // port: 5555,
      username: 'postgreso',
      // password: 'DP25cos454345',
      password: 'postgreso',
      // database: 'kupipodariday',
      database: 'postgreso',
      entities: [User, Wish, WishList, Offer],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
