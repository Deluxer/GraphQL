import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './entities/list.entity';

import { ItemsModule } from '../items/items.module';
import { ListItemModule } from '../list-item/list-item.module';

import { ListService } from './list.service';
import { ListResolver } from './list.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([List]),
    ListItemModule,
    ItemsModule
  ],
  providers: [
    ListResolver,
    ListService
  ],
  exports: [ 
    ListService,
    TypeOrmModule
  ]
})
export class ListModule {}
