import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';

import { Item } from '../items/entities/item.entity';
import { User } from './entities/user.entity';
import { List } from '../list/entities/list.entity';

import { UsersService } from './users.service';
import { ItemsService } from '../items/items.service';
import { ListService } from '../list/list.service';

import { ValidRolesArgs } from './dto/args/roles.arg';
import { PaginationArgs, SearchArgs } from '../common/dto/args';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decoratos/current-user.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dto/update-user.input';


@Resolver(() => User)
@UseGuards( JwtAuthGuard )
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemService: ItemsService,
    private readonly listService: ListService
  ) {}

  @Query(() => [User], { name: 'users' })
  async findAll(
    @Args() ValidRolesArgs: ValidRolesArgs,
    @CurrentUser([ValidRoles.admin]) user: User
  ): Promise<User[]> {
    return this.usersService.findAll(ValidRolesArgs.roles);
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin]) user: User
  ): Promise<User> {
    return this.usersService.findById(id);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.admin]) user: User
  ): Promise<User> {
    return this.usersService.update(updateUserInput.id, updateUserInput, user);
  }

  @Mutation(() => User, {name: 'blockUser'})
  blockUser(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser([ValidRoles.admin]) user: User
  ): Promise<User> {
    return this.usersService.block(id, user);
  }

  @ResolveField( () => Int, { name: 'itemCount'} )
  async itemCount(
    @CurrentUser([ ValidRoles.admin ]) adminUser: User,
    @Parent() user: User
  ): Promise<number> {
    return this.itemService.itemCounByUser(user);
  }

  @ResolveField( () => [Item], { name: 'items'} )
  async getItemsByUser(
    @CurrentUser([ ValidRoles.admin ]) adminUser: User,
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<Item[]> {
    return this.itemService.findAll(user, paginationArgs, searchArgs)
  }

  @ResolveField( () => [List], { name: 'lists'})
  getListByUser(
    @CurrentUser([ ValidRoles.admin ]) adminUser: User,
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<List[]> {
    return this.listService.findAll(user, paginationArgs, searchArgs)
  }
}
