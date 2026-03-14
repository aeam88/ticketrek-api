import { IsString, IsNotEmpty, IsInt, IsDate, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ example: 'Tech Conference 2026', description: 'Name of the event' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Annual technology conference covering AI and Web Dev.', description: 'Detailed description of the event' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 500, description: 'Maximum capacity of attendees. Must be at least 1.', minimum: 1 })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiProperty({ example: '2026-10-15T09:00:00Z', description: 'Date and time of the event in ISO format' })
  @IsDate()
  @Type(() => Date)
  date: Date;
}
