import { IsString } from 'class-validator';

export class ConfirmEmailDto {
  @IsString()
  verifyToken: string;
}
