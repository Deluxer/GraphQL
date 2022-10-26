import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';

import { UsersService } from 'src/users/users.service';
import { LoginInputDto } from './dto/input/login.unput';
import { SignUpInputDto } from './dto/input/signup.unput';
import { AuthResponse } from './types/auth-response.type';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async signup(signupInput: SignUpInputDto): Promise<AuthResponse> {

        const user = await this.userService.create(signupInput);
        
        return {
            token: this.getJwtToken(user.id),
            user
        };
    }

    async login(loginInput: LoginInputDto): Promise<AuthResponse> {
        const { email, password } = loginInput;
        const user = await this.userService.findByEmail(email);

        if(!bcrypt.compareSync(password, user.password))  {
            throw new BadRequestException('Email / passwprd do not match');
        }
        
        return {
            token: this.getJwtToken(user.id),
            user
        };
    }

    async validateUser(id: string ): Promise<User> {
        const user = await this.userService.findById(id)
        
        if (!user.isActive ) throw new UnauthorizedException(`User is inactive`);
        
        delete user.password;

        return user;
    }

    revalidateToken(user: User): AuthResponse {

        return {
            token: this.getJwtToken(user.id),
            user
        };
    }

    private getJwtToken (userId: string) {
        return this.jwtService.sign({ userId })
    }
}
