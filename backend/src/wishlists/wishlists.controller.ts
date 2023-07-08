import {
  UseGuards,
  Controller,
  Post,
  Patch,
  Body,
  Param,
  Get,
  Req,
  Delete,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { WishListsService } from './wishlists.service';
import { CreateWishListDto } from './dto/create-wishlist.dto';
import { UpdateWishListDto } from './dto/update-wishlist.dto';

@Controller('wishlists')
@UseGuards(JwtGuard)
export class WishListsController {
  constructor(private readonly wishlistsService: WishListsService) {}

  // create new wishlist
  @Post()
  create(@Req() req, @Body() createWishlistDto: CreateWishListDto) {
    return this.wishlistsService.create(createWishlistDto, req.user);
  }

  //find all wishlists
  @Get()
  getAll() {
    return this.wishlistsService.findAll();
  }

  // get single wishList
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.wishlistsService.findOne(+id);
  }

  // update wishList
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req,
    @Body() updateWishlistDto: UpdateWishListDto,
  ) {
    return this.wishlistsService.updateOne(+id, req.user.id, updateWishlistDto);
  }

  // remove wishList
  @Delete(':id')
  removeOne(@Param('id') id: string, @Req() req) {
    return this.wishlistsService.removeOne(+id, req.user.id);
  }
}
