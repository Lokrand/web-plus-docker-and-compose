import {
  Controller,
  UseGuards,
  Post,
  Get,
  Body,
  Req,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  // create new wish
  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(req.user, createWishDto);
  }

  // get all wishes
  @UseGuards(JwtGuard)
  @Get()
  getAll() {
    return this.wishesService.findAll();
  }

  // get last wishes
  @Get('last')
  getLast() {
    return this.wishesService.findTopOrLast({ createdAt: 'DESC' }, 40);
  }

  // get top wishes
  @Get('top')
  getTop() {
    return this.wishesService.findTopOrLast({ copied: 'DESC' }, 10);
  }

  // get single wish
  @UseGuards(JwtGuard)
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.wishesService.findOne(+id);
  }

  // update wish
  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateWishDto, @Req() req) {
    return this.wishesService.update(id, dto, req.user.id);
  }

  // remove wish
  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.wishesService.remove(+id, req.user.id);
  }

  // copy wish
  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copy(@Param('id') id: number, @Req() req) {
    return this.wishesService.copy(id, req.user);
  }
}
