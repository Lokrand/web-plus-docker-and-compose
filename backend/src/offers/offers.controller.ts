import {
  UseGuards,
  Controller,
  Post,
  Body,
  Param,
  Get,
  Req,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateOfferDto } from './dto/create-offer.dto';

@Controller('offers')
@UseGuards(JwtGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  // create new offer
  @Post()
  create(@Req() req, @Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(createOfferDto, req.user);
  }

  //find all offers
  @Get()
  getAll() {
    return this.offersService.findAll();
  }

  // get single offer
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.offersService.findOne(+id);
  }
}
