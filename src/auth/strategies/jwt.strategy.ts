import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/users/entities/user.entity";
import { AuthService } from "../auth.service";
import { JwtPaylodInterface } from "../interfaces/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor(
        configService: ConfigService,
        private readonly authService: AuthService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }


    async validate(payload: JwtPaylodInterface): Promise<User> {
        const { userId } = payload;
        const user = await this.authService.validateUser(userId)
        
        return user;
    }


}