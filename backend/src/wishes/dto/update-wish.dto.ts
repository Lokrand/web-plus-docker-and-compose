import { IsOptional, IsUrl, Length } from 'class-validator';

export class UpdateWishDto {
  @Length(1, 250)
  @IsOptional()
  name: string;

  @IsUrl()
  @IsOptional()
  link: string;

  @IsOptional()
  price: number;

  @IsUrl()
  @IsOptional()
  image: string;

  @Length(1, 1024)
  @IsOptional()
  description: string;
}
