import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';

import { ListItem } from './entities/list-item.entity';
import { User } from '../users/entities/user.entity';
import { ListItemService } from './list-item.service';

import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decoratos/current-user.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';


@Resolver(() => ListItem)
@UseGuards( JwtAuthGuard )
export class ListItemResolver {
  constructor(private readonly listItemService: ListItemService) {}

  @Mutation(() => ListItem)
  createListItem(
    @Args('createListItemInput') createListItemInput: CreateListItemInput,
    @CurrentUser([ ValidRoles.admin ]) user: User
  ): Promise<ListItem> {
    return this.listItemService.create(createListItemInput);
  }

  // @Query(() => [ListItem], { name: 'listItem' })
  // findAll() {
  //   return this.listItemService.findAll();
  // }

  @Query(() => ListItem, { name: 'listItem' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string
  ): Promise<ListItem> {
    return this.listItemService.findOne(id);
  }

  @Mutation(() => ListItem, { name: "updateListItem" })
  async updateListItem(
    @Args('updateListItemInput') updateListItemInput: UpdateListItemInput
  ): Promise<ListItem> {
    return this.listItemService.update(updateListItemInput.id, updateListItemInput);
  }

  // @Mutation(() => ListItem)
  // removeListItem(@Args('id', { type: () => Int }) id: number) {
  //   return this.listItemService.remove(id);
  // }
}
