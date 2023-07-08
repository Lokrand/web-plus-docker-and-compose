import { Length, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateWishDto {
  @Length(1, 250)
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsNotEmpty()
  link: string;

  @IsNotEmpty()
  price: number;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @Length(1, 1024)
  description: string;
}
