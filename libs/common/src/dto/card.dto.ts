import { IsCreditCard, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CardDto {
  @IsString()
  @IsNotEmpty()
  cvv: string;

  @IsCreditCard()
  @IsNotEmpty()
  number: string;

  @IsNumber()
  @IsNotEmpty()
  exp_month: number;

  @IsNumber()
  @IsNotEmpty()
  exp_year: number;
}
