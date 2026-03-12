import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Role } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createEventDto: CreateEventDto) {
    return this.prisma.event.create({
      data: {
        ...createEventDto,
        organizerId: userId,
      },
      include: {
        organizer: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.event.findMany({
      include: {
        organizer: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  async update(id: string, userId: string, updateEventDto: UpdateEventDto, userRole: Role) {
    const event = await this.findOne(id);

    if (event.organizerId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('You are not allowed to update this event');
    }

    return this.prisma.event.update({
      where: { id },
      data: updateEventDto,
    });
  }

  async remove(id: string, userId: string, userRole: Role) {
    const event = await this.findOne(id);

    if (event.organizerId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('You are not allowed to delete this event');
    }

    return this.prisma.event.delete({
      where: { id },
    });
  }
}
