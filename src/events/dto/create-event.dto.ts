import { IsString, IsNotEmpty, IsInt, IsDate, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsDate()
  @Type(() => Date)
  date: Date;
}
