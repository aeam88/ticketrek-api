import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '@prisma/client';
import type { Request } from 'express';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  getMe(@Req() req: Request) {
    const user = req.user as any;
    return this.usersService.findOne(user.sub);
  }

  @Patch('me')
  updateMe(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const user = req.user as any;
    return this.usersService.update(user.sub, updateUserDto);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
