import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class VerifyMagicLinkDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2048)
  token: string;
}