import {
  Controller,
  Get,
  Param,
  Put,
  Body,
  UseGuards,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { User } from '../schemas/user.schema';
import { RolesGuard } from '../auth/roles.guard';
import { IsAdmin } from '../auth/roles.decorator';
import { UpdateUserDto } from 'src/DTOs/updateUserDTO.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(RolesGuard)
  @IsAdmin(true)
  @Get(':email')
  async findOne(@Param('email') email: string): Promise<User | undefined> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @UseGuards(RolesGuard)
  @IsAdmin(true)
  @Put(':email')
  async updateUser(
    @Param('email') email: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.usersService.updateUser(email, updateUserDto);
  }

  @UseGuards(RolesGuard)
  @IsAdmin(true)
  @Get()
  async listUsers(): Promise<User[]> {
    return this.usersService.listUsers();
  }

  @UseGuards(RolesGuard)
  @IsAdmin(true)
  @Delete('')
  async deleteUser(@Param('email') email: string): Promise<User> {
    return this.usersService.deleteUser(email);
  }
}
