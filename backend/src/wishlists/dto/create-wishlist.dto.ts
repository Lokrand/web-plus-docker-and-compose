import { IsArray, IsOptional, IsUrl, Length } from 'class-validator';
import { Wish } from 'src/wishes/entities/wishes.entity';

export class CreateWishListDto {
  @Length(1, 250)
  name: string;

  @Length(1, 1500)
  description: string;

  @IsUrl()
  image: string;

  @IsOptional()
  @IsArray()
  items: Wish[];
}
