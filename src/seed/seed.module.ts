import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { ItemsModule } from 'src/items/items.module';
import { UsersModule } from 'src/users/users.module';

import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { ListItemModule } from 'src/list-item/list-item.module';
import { ListModule } from 'src/list/list.module';

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
