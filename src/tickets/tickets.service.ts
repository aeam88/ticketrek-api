import { ForbiddenException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BuyTicketDto } from './dto/buy-ticket.dto';
import { TicketStatus } from '@prisma/client';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class TicketsService {
  constructor(
    private prisma: PrismaService,
    private paymentsService: PaymentsService,
  ) {}

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

    if (event.price > 0 && !dto.paymentMethod) {
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const qrCode = Buffer.from(`${userId}-${dto.eventId}-${Date.now()}`).toString('base64');

    const ticket = await this.prisma.ticket.create({
      data: {
        eventId: dto.eventId,
        userId: userId,
        qrCode: qrCode,
        status: event.price > 0 ? TicketStatus.PENDING : TicketStatus.VALID,
      },
    });

    if (event.price > 0) {
      const preference = await this.paymentsService.createPreference(
        ticket.id,
        event.title,
        event.price,
        user.email,
      );
      return {
        ticket,
        payment_url: preference.init_point,
      };
    }

    return ticket;
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
