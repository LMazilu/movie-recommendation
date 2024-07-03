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

/**
 * Finds a user by their email address.
 *
 * @param {string} email - The email address of the user to find.
 * @return {Promise<User | undefined>} A promise that resolves to the found user or undefined.
 * @throws {NotFoundException} If the user is not found.
 */
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * Finds a user by their email address.
   * NEEDS TO BE ADMIN!
   *
   * @param {string} email - The email address of the user to find.
   * @return {Promise<User | undefined>} A promise that resolves to the found user or undefined.
   * @throws {NotFoundException} If the user is not found.
   */
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

  /**
   * Updates a user's information.
   * NEEDS TO BE ADMIN!
   *
   * @param {string} email - The email address of the user to update.
   * @param {UpdateUserDto} updateUserDto - The data transfer object containing the updated user information.
   * @return {Promise<User>} A promise that resolves to the updated user.
   * @throws {NotFoundException} If the user is not found.
   */
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
  /**
   * Lists all users.
   * NEEDS TO BE ADMIN!
   *
   * @return {Promise<User[]>} A promise that resolves to an array of all users.
   */
  @UseGuards(RolesGuard)
  @IsAdmin(true)
  @Get()
  async listUsers(): Promise<User[]> {
    return this.usersService.listUsers();
  }

  /**
   * Deletes a user by their email address.
   * NEEDS TO BE ADMIN!
   *
   * @param {string} email - The email address of the user to delete.
   * @return {Promise<User>} A promise that resolves to the deleted user.
   */
  @UseGuards(RolesGuard)
  @IsAdmin(true)
  @Delete('')
  async deleteUser(@Param('email') email: string): Promise<User> {
    return this.usersService.deleteUser(email);
  }
}
