import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

import { LoginInputDto } from './dto/input/login.unput';
import { SignUpInputDto } from './dto/input/signup.unput';
import { AuthResponse } from './types/auth-response.type';
import { CurrentUser } from './decoratos/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ValidRoles } from './enums/valid-roles.enum';

@Resolver( () => AuthResponse )
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation( () => AuthResponse , { name: 'signup'})
  async signup(
    @Args('signupInput') signUpInput: SignUpInputDto
  ): Promise<AuthResponse> {
    return this.authService.signup( signUpInput);
  }

  @Mutation( () => AuthResponse, { name: 'login'})
  async login(
    @Args('loginInput') loginInput: LoginInputDto
  ): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  @Query( () => AuthResponse, { name: 'revalidate' })
  @UseGuards( JwtAuthGuard )
  revalidateToken(
    @CurrentUser([ValidRoles.user]) user: User
  ): AuthResponse {
    return this.authService.revalidateToken(user);
  }
}
