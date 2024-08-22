import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { JWT_CONST } from 'src/constant';
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async register(registerDto: RegisterUserDto): Promise<User> {
    const hashPassword = await this.hashPassword(registerDto.password);
    return this.userRepository.save({
      ...registerDto,
      password: hashPassword,
    });
  }

  async login(loginDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordMatching = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = { id: user.id, email: user.email };

    return this.generateToken(payload);
  }

  async refreshToken(refresh_token: string): Promise<any> {
    try {
      const verify = await this.jwtService.verifyAsync(refresh_token, {
        secret: JWT_CONST.REFRESH_SECRET,
      });

      const checkExistToken = await this.userRepository.findOneBy({
        email: verify.email,
        refresh_token,
      });

      if (checkExistToken) {
        return this.generateToken({ id: verify.id, email: verify.email });
      } else {
        throw new HttpException(
          'Refresh token is not valid',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  private async generateToken(payload: { id: number; email: string }): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: JWT_CONST.REFRESH_SECRET,
      expiresIn: '1d',
    });

    await this.userRepository.update(
      { email: payload.email },
      { refresh_token: refreshToken },
    );

    return { accessToken, refreshToken };
  }
  
  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
  }
}
