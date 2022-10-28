import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { ItemsModule } from '../items/items.module';
import { UsersModule } from '../users/users.module';
import { ListModule } from '../list/list.module';
import { ListItemModule } from '../list-item/list-item.module';

import { SeedResolver } from './seed.resolver';
import { SeedService } from './seed.service';

@Module({
  providers: [SeedResolver, SeedService],
  imports: [
    ConfigModule,
    UsersModule,
    ItemsModule,
    ListItemModule,
    ListModule
  ],
})
export class SeedModule {}
