import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from './strategies/jwt.strategy';

import { UsersModule } from '../users/users.module';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService],
      useFactory: ( configService: ConfigService ) => ({
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '4h'
          }
        })
    }),
    UsersModule,

  ],
  providers: [AuthResolver, AuthService, JwtStrategy],
  exports: [JwtStrategy, JwtModule, PassportModule]
})
export class AuthModule {}
