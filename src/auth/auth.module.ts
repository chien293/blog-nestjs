import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { JWT_CONST } from 'src/constant';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: JWT_CONST.ACCESS_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    ConfigModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
