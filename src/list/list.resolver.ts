import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decoratos/current-user.decorator';
import { PaginationArgs, SearchArgs } from '../common/dto/args';
import { ListService } from './list.service';

import { List } from './entities/list.entity';
import { User } from '../users/entities/user.entity';

import { CreateListInput, UpdateListInput } from './dto';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { ListItemService } from 'src/list-item/list-item.service';
import { Item } from 'src/items/entities/item.entity';
import { ItemsService } from 'src/items/items.service';

@Resolver(() => List)
@UseGuards(JwtAuthGuard)
export class ListResolver {
  constructor(
    private readonly listService: ListService,
    private readonly listItemService: ListItemService,
    private readonly itemsService: ItemsService
  ) {}

  @Mutation(() => List, { name: 'createList'})
  createList(
    @CurrentUser() user: User,
    @Args('createListInput') createListInput: CreateListInput,
  ): Promise<List> {
    return this.listService.create(createListInput, user);
  }

  @Query(() => [List], { name: 'lists' })
  findAll(
    @CurrentUser() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<List[]> {
    return this.listService.findAll(user, paginationArgs, searchArgs);
  }

  @Query(() => List, { name: 'list' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe ) id: string,
    @CurrentUser() user: User
  ): Promise<List> {
    return this.listService.findOne(id, user);
  }

  @Mutation(() => List, { name: 'updateList' })
  updateList(
    @Args('updateListInput') updateListInput: UpdateListInput,
    @CurrentUser() user: User
  ): Promise<List> {
    return this.listService.update(updateListInput.id, updateListInput, user);
  }

  @Mutation(() => List, { name: 'removeList'})
  removeList(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User
  ): Promise<List> {
    return this.listService.remove(id, user);
  }

  @ResolveField( () => [ListItem], { name: 'items'} )
  getListitems(
    @Parent() list: List,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<ListItem[]> {
    return this.listItemService.findAll(list, paginationArgs, searchArgs);
  }

  @ResolveField( () => Number, { name: 'totalItems'})
  async totalItems(
    @Parent() list: List
  ): Promise<number> {
    return this.listItemService.countItemListByList(list);
  }
}
