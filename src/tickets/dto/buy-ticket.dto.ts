import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BuyTicketDto {
  @ApiProperty({ example: 'evt_12345', description: 'ID of the event to buy ticket for' })
  @IsNotEmpty()
  @IsString()
  eventId: string;

  @ApiPropertyOptional({ example: 'stripe', description: 'Payment method to use' })
  @IsString()
  paymentMethod?: string;
}
