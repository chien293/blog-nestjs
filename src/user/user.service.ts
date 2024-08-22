import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getAllUser(): Promise<User[]> {
    return await this.userRepository.find({
      select: [
        'id',
        'first_name',
        'last_name',
        'email',
        'status',
        'created_at',
        'updated_at',
      ],
    });
  }

  async getOneUser(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async createUser(body: CreateUserDto): Promise<User> {
    const hashPassword = await this.hashPassword(body.password);
    return await this.userRepository.save({
      ...body,
      password: hashPassword,
    });
  }

  async updateUser(id: number, body: UpdateUserDto): Promise<UpdateResult> {
    return await this.userRepository.update(id, body);
  }

  async deleteUser(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
  }
}
