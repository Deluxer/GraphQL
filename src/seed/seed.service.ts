import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { ItemsService } from 'src/items/items.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';

@Injectable()
export class SeedService {

    private isProd: Boolean;

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly usersService: UsersService,
        private readonly itemsService: ItemsService,
    ) {
        this.isProd = configService.get('STATE') === 'prod';
    }

    async executeSeed() {
        
        if( this.isProd ) {
            throw new UnauthorizedException('We cannot seed in prod');
        }

        // clean database
        this.deleteDatabase();

        // Create users
        const user = await this.loadUser();

        this.loadItems(user);
        // create items

        
        return true;
    }

    async deleteDatabase() {
        await this.itemRepository.createQueryBuilder()
        .delete()
        .where({})
        .execute();

        await this.userRepository.createQueryBuilder()
        .delete()
        .where({})
        .execute();
    }

    async loadUser(): Promise<User> {
        const users = [];

        for (const user of SEED_USERS ) {
            users.push( await this.usersService.create(user) );
        }

        return users[0];
    }

    async loadItems(user: User) : Promise<Item> {
        const itemsPromises = [];
        
        for (const item of SEED_ITEMS) {
            itemsPromises.push( await this.itemsService.create(item, user) );
        }
        
        await Promise.all( itemsPromises );
        
        return itemsPromises[0];
    }
}
