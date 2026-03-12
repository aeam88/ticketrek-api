import { IsNotEmpty, IsString } from 'class-validator';

export class BuyTicketDto {
  @IsNotEmpty()
  @IsString()
  eventId: string;
}
