import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


import { Item } from '../items/entities/item.entity';
import { User } from '../users/entities/user.entity';
import { List } from 'src/list/entities/list.entity';
import { ListItem } from 'src/list-item/entities/list-item.entity';

import { ItemsService } from '../items/items.service';
import { UsersService } from '../users/users.service';
import { ListService } from 'src/list/list.service';

import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from './data/seed-data';
import { ListItemService } from 'src/list-item/list-item.service';

@Injectable()
export class SeedService {

    private isProd: Boolean;

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,
        
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        
        @InjectRepository(ListItem)
        private readonly listItemRespository: Repository<ListItem>,

                
        @InjectRepository(List)
        private readonly listRepository: Repository<List>,

        private readonly usersService: UsersService,
        private readonly itemsService: ItemsService,
        private readonly listService: ListService,
        private readonly listItemService: ListItemService
    ) {
        this.isProd = configService.get('STATE') === 'prod';
    }

    async executeSeed() {
        
        if( this.isProd ) {
            throw new UnauthorizedException('We cannot seed in prod');
        }

        this.deleteDatabase();

        const user = await this.loadUser();

        this.loadItems(user);

        const list = await this.loadList(user);
        const items = await this.itemsService.findAll(user, { limit: 15, offset: 0 }, {})
        this.loadListItem(list, items)
        
        return true;
    }

    async deleteDatabase() {

        await this.listItemRespository.createQueryBuilder()
        .delete()
        .where({})
        .execute();

        await this.listRepository.createQueryBuilder()
        .delete()
        .where({})
        .execute();

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

    async loadList(user: User) : Promise<List> {
        const listsPromises = [];
        
        for (const list of SEED_LISTS) {
            listsPromises.push( await this.listService.create(list, user) );
        }
        
        await Promise.all( listsPromises );
        
        return listsPromises[0];
    }

    async loadListItem(list: List, items: Item[]) {
        
        for (const item of items) {
            this.listItemService.create({
                quantity: Math.round( Math.random() * 10),
                completed: Math.round( Math.random() * 1) === 0 ? false : true,
                listId: list.id,
                itemId: item.id
            });
        }
    }

}
