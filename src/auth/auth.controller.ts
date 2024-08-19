import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { User } from 'src/user/entity/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {
        
    }
    @Post('register')
    register(@Body() body: RegisterUserDto): Promise<User> {
        return this.authService.register(body);
    }

    @Post('login')
    @UsePipes(ValidationPipe)
    login(@Body() body: LoginUserDto): Promise<any> {
        return this.authService.login(body);
    }

    @Post('refresh-token')
    refresheToken(@Body() {refresh_token}): Promise<any> {
        return this.authService.refreshToken(refresh_token);
    }
}
