import { IsArray, IsOptional, IsUrl, Length } from 'class-validator';
import { Wish } from 'src/wishes/entities/wishes.entity';

export class UpdateWishListDto {
  @IsOptional()
  @Length(1, 250)
  name: string;

  @IsOptional()
  @Length(1, 1500)
  description: string;

  @IsUrl()
  @IsOptional()
  image: string;

  @IsOptional()
  @IsArray()
  items: Wish[];
}
