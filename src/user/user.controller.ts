import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { User } from './entity/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
    constructor(private userSerice: UserService) { }

    @UseGuards(AuthGuard)
    @Get()
    getAllUser(): Promise<User[]> {
       return this.userSerice.getAllUser();
    }

    @UseGuards(AuthGuard)
    @Get()
    getOneUser(@Param('id') id: number): Promise<User> {
       return this.userSerice.getOneUser(id);
    }

    @UseGuards(AuthGuard)
    @Post()
    createUser(@Body() body: CreateUserDto): Promise<User> {
       return this.userSerice.createUser(body);
    }

    @UseGuards(AuthGuard)
    @Put(':id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto): Promise<UpdateResult> {
       return this.userSerice.updateUser(Number(id), body);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
       return this.userSerice.deleteUser(Number(id));
    }
}
