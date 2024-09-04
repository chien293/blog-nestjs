import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Like, Repository, UpdateResult } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getAllUser(query: FilterUserDto): Promise<any> {
    const items_per_page = Number(query.items_per_page) || 10;
    const page = Number(query.page) || 1;
    const offset = (page - 1) * items_per_page;

    const keyword = query.search || '';

    const [res, total] = await this.userRepository.findAndCount({
      select: [
        'id',
        'first_name',
        'last_name',
        'email',
        'status',
        'created_at',
        'updated_at',
      ],
      where: [
        { first_name: Like(`%${keyword}%`) },
        { last_name: Like(`%${keyword}%`) },
        { email: Like(`%${keyword}%`) },
      ],
      order: { created_at: 'DESC' },
      take: items_per_page,
      skip: offset,
    });

    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;

    return {
      data: res,
      total,
      current_page: page,
      nextPage,
      prevPage,
      lastPage,
    };
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

  async updateAvatar(id: number, avatar: string): Promise<UpdateResult> {
    return await this.userRepository.update(id, { avatar });
  }

  async multipleDelete(ids: string[]): Promise<DeleteResult> {
    return await this.userRepository.delete({ id: In(ids) });
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
  }
}
