import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ListModule } from '../list/list.module';
import { ItemsModule } from '../items/items.module';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ItemsModule,
    ListModule
  ],
  exports: [
    TypeOrmModule,
    UsersService
  ] ,
  providers: [
    UsersResolver,
    UsersService
  ]
})
export class UsersModule {}
