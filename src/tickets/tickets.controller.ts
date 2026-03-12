import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { BuyTicketDto } from './dto/buy-ticket.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Controller('tickets')
@UseGuards(AuthGuard('jwt'))
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('buy')
  buyTicket(@Req() req: Request, @Body() dto: BuyTicketDto) {
    const user = req.user as any;
    return this.ticketsService.buyTicket(user.sub, dto);
  }

  @Get('my')
  getMyTickets(@Req() req: Request) {
    const user = req.user as any;
    return this.ticketsService.getMyTickets(user.sub);
  }

  @Get('event/:eventId')
  getEventTickets(@Req() req: Request, @Param('eventId') eventId: string) {
    const user = req.user as any;
    return this.ticketsService.getEventTickets(user.sub, eventId);
  }

  @Patch(':id/use')
  useTicket(@Req() req: Request, @Param('id') ticketId: string) {
    const user = req.user as any;
    return this.ticketsService.useTicket(user.sub, ticketId);
  }
}
