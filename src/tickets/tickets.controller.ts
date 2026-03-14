import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { BuyTicketDto } from './dto/buy-ticket.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import type { Request } from 'express';

@ApiTags('Tickets')
@ApiBearerAuth()
@Controller('tickets')
@UseGuards(AuthGuard('jwt'))
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('buy')
  @ApiOperation({ summary: 'Buy a new ticket for an event' })
  @ApiResponse({ status: 201, description: 'Ticket successfully purchased.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Event not found or user not found.' })
  buyTicket(@Req() req: Request, @Body() dto: BuyTicketDto) {
    const user = req.user as any;
    return this.ticketsService.buyTicket(user.sub, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get all tickets for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of tickets.' })
  getMyTickets(@Req() req: Request) {
    const user = req.user as any;
    return this.ticketsService.getMyTickets(user.sub);
  }

  @Get('event/:eventId')
  @ApiOperation({ summary: 'Get all tickets for a specific event (Organizer/Admin only)' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiResponse({ status: 200, description: 'List of tickets for the given event.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  getEventTickets(@Req() req: Request, @Param('eventId') eventId: string) {
    const user = req.user as any;
    return this.ticketsService.getEventTickets(user.sub, eventId);
  }

  @Patch(':id/use')
  @ApiOperation({ summary: 'Mark a ticket as used (Scan ticket)' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiResponse({ status: 200, description: 'Ticket successfully marked as used.' })
  @ApiResponse({ status: 400, description: 'Ticket already used.' })
  @ApiResponse({ status: 404, description: 'Ticket not found.' })
  useTicket(@Req() req: Request, @Param('id') ticketId: string) {
    const user = req.user as any;
    return this.ticketsService.useTicket(user.sub, ticketId);
  }
}
