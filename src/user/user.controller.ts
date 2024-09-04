import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from './entity/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';

@Controller('user')
export class UserController {
  constructor(private userSerice: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  getAllUser(@Query() query: FilterUserDto): Promise<User[]> {
    return this.userSerice.getAllUser(query);
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
  updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<UpdateResult> {
    return this.userSerice.updateUser(Number(id), body);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userSerice.deleteUser(Number(id));
  }

  @Post('upload-avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: storageConfig('avatar'),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.png', '.jpeg'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError =
              'File size is too large. Accepted file size is less than 5 MB';
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  uploadAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.userSerice.updateAvatar(
      req.user_data.id,
      file.destination + '/' + file.filename,
    );
  }
}
