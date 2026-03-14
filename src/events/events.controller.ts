import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import type { Request } from 'express';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ORGANIZER, Role.ADMIN)
  @ApiOperation({ summary: 'Create a new event (Organizer/Admin only)' })
  @ApiResponse({ status: 201, description: 'Event successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Organizer/Admin role required.' })
  create(@Req() req: Request, @Body() createEventDto: CreateEventDto) {
    const user = req.user as any;
    return this.eventsService.create(user.sub, createEventDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all public events' })
  @ApiResponse({ status: 200, description: 'List of events.' })
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an event by ID' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiResponse({ status: 200, description: 'Return event details.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ORGANIZER, Role.ADMIN)
  @ApiOperation({ summary: 'Update an event (Organizer/Admin only)' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiResponse({ status: 200, description: 'Event successfully updated.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const user = req.user as any;
    return this.eventsService.update(id, user.sub, updateEventDto, user.role);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ORGANIZER, Role.ADMIN)
  @ApiOperation({ summary: 'Delete an event (Organizer/Admin only)' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiResponse({ status: 200, description: 'Event successfully deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as any;
    return this.eventsService.remove(id, user.sub, user.role);
  }
}
