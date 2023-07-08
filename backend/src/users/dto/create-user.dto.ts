import {
  IsString,
  Length,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  IsUrl,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 30)
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  avatar: string;

  @IsString()
  @Length(2, 200)
  @IsOptional()
  about: string;
}
