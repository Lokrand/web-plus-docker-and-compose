import {
  IsString,
  Length,
  IsEmail,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(2, 30)
  @IsNotEmpty()
  @IsOptional()
  username: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsString()
  @Length(2, 200)
  @IsOptional()
  about: string;
}
