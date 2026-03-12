import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BuyTicketDto } from './dto/buy-ticket.dto';
import { TicketStatus } from '@prisma/client';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async buyTicket(userId: string, dto: BuyTicketDto) {
    const event = await this.prisma.event.findUnique({
      where: { id: dto.eventId },
      include: {
        _count: {
          select: { tickets: true },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event._count.tickets >= event.capacity) {
      throw new ForbiddenException('Event is sold out');
    }


    const qrCode = Buffer.from(`${userId}-${dto.eventId}-${Date.now()}`).toString('base64');

    return this.prisma.ticket.create({
      data: {
        eventId: dto.eventId,
        userId: userId,
        qrCode: qrCode,
        status: TicketStatus.VALID,
      },
    });
  }

  async getMyTickets(userId: string) {
    return this.prisma.ticket.findMany({
      where: { userId },
      include: {
        event: true,
      },
    });
  }

  async getEventTickets(userId: string, eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.organizerId !== userId) {
      throw new ForbiddenException('Only the organizer can view these tickets');
    }

    return this.prisma.ticket.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async useTicket(userId: string, ticketId: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { event: true },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }


    if (ticket.event.organizerId !== userId) {
      throw new ForbiddenException('Only the organizer can validate tickets');
    }

    if (ticket.status === TicketStatus.USED) {
      throw new ForbiddenException('Ticket has already been used');
    }

    return this.prisma.ticket.update({
      where: { id: ticketId },
      data: {
        status: TicketStatus.USED,
      },
    });
  }
}
