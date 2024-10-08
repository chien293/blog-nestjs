import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/user/entity/user.entity';
import { PostService } from './post.service';


@Module({
  imports:[
    TypeOrmModule.forFeature([Post, User])
  ],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
