import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsModule } from 'src/items/items.module';
import { ListModule } from 'src/list/list.module';

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
