import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { Request } from "express";
import { JWT_CONST } from "src/constant";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractJwtFromRequest(request);

        if(!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload = this.jwtService.verifyAsync(token,{
                secret: JWT_CONST.ACCESS_SECRET
            });

            request['user_data'] = payload;

        } catch (error) {
            throw new UnauthorizedException();
        }

        return true;
    }

    private extractJwtFromRequest(request: Request): string | undefined {
        const [type, token] = request.headers.authorization ? request.headers.authorization.split(' ') : [];

        return type === 'Bearer' ? token : undefined;
    }
}