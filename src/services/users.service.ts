import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from 'src/DTOs/updateUserDTO.dto';
import { UserResponseDTO } from 'src/DTOs/UserResponseDTO.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * Retrieves a user based on the provided email address.
   *
   * @param {string} email - The email address of the user.
   * @return {Promise<User | null>} A promise that resolves to the user object if found, or null otherwise.
   */
  async findOne(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email, isDeleted: 0 }).exec();
  }

  /**
   * Retrieves a user based on the provided id.
   *
   * @param {Number} id - The id of the user.
   * @return {Promise<User | null>} A promise that resolves to the user object if found, or null otherwise.
   */
  async findOneById(id: number): Promise<UserDocument | null> {
    return this.userModel.findOne({ _id: id, isDeleted: 0 }).exec();
  }

  /**
   * Retrieves a list of all users that have not been deleted.
   *
   * @return {Promise<UserDocument[]>} A promise that resolves to an array of UserDocument objects representing the users.
   */
  async listUsers(): Promise<UserDocument[]> {
    return this.userModel.find({ isDeleted: 0 }).exec();
  }

  /**
   * Creates a new user with the given email, password, and admin status.
   *
   * @param {string} email - The email address of the user.
   * @param {string} password - The password of the user.
   * @param {boolean} isAdmin - The admin status of the user.
   * @return {Promise<User>} A promise that resolves to the created user.
   */
  async createUser(
    email: string,
    password: string,
    isAdmin: boolean,
  ): Promise<Omit<User, 'password'>> {
    const newUser = new this.userModel({
      email,
      password,
      isAdmin,
      isDeleted: 0,
    });
    const alreadyExists = await this.findOne(email);
    if (alreadyExists) {
      throw new ConflictException('User already exists');
    }
    return await newUser.save();
  }

  /**
   * Validates the password for a user.
   *
   * @param {string} email - The email address of the user.
   * @param {string} password - The password to validate.
   * @return {Promise<boolean>} A promise that resolves to true if the password is valid, false otherwise.
   */
  async validatePassword(email: string, password: string): Promise<boolean> {
    const user = await this.findOne(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return isPasswordValid;
  }

  async updateUser(
    email: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    const user = await this.findOne(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(
        parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '', 10),
      );
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    Object.assign(user, updateUserDto);
    return user.save();
  }

  async deleteUser(email: string): Promise<UserDocument> {
    const user = await this.findOne(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.isDeleted = true;
    return user.save();
  }
}
