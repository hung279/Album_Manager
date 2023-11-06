import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @MaxLength(30)
  @MinLength(8)
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @IsOptional()
  readonly verifyToken?: string;
}
