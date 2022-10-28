import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { List } from './entities/list.entity';
import { User } from '../users/entities/user.entity';

import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { PaginationArgs, SearchArgs } from '../common/dto/args';

@Injectable()
export class ListService {

  constructor(
    @InjectRepository(List)
    private readonly listsRepository: Repository<List>
  ) {}

  async create(createListInput: CreateListInput, user: User): Promise<List> {
    const itemList = this.listsRepository.create({...createListInput, user});
    return await this.listsRepository.save(itemList);
  }

  async findAll(user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<List[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;
    const queryBuilder = this.listsRepository.createQueryBuilder()
    .where('"userId" =:userId', { userId: user.id})
    .take(limit)
    .skip(offset);
    
    if(search) {
      queryBuilder.andWhere("LOWER(name) like :name", { name: `%${ search.toLowerCase() }%`})
    }

    return await queryBuilder.getMany();
  }

  async findOne(id: string, user: User): Promise<List> {
    const list = await this.listsRepository.findOneBy({
      id,
      user: { id: user.id }
    });
    if(!list) {
      throw new BadRequestException(`Item ${ id } not found`);
    }

    return list;
  }

  async update(id: string, updateListInput: UpdateListInput, user: User): Promise<List> {
    await this.findOne(id, user);

    const list = await this.listsRepository.preload({...updateListInput, user});
    return this.listsRepository.save(list)
  }


  async itemCounByUser(user: User): Promise<number> {
    return this.listsRepository.count({
      where: {
        user: {
          id: user.id
        }
      }
    })
  }

  async remove(id: string, user: User): Promise<List> {
    const list = await this.findOne(id, user);
    const listDB = await this.listsRepository.remove(list);
    return { ...listDB, id }
  }
}
