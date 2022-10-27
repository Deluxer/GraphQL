import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { List } from 'src/list/entities/list.entity';
import { Repository } from 'typeorm';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { ListItem } from './entities/list-item.entity';

@Injectable()
export class ListItemService {

  constructor(
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>
  ) {}

  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    const { itemId, listId, ...rest } = createListItemInput;
    const newList = this.listItemRepository.create({
      ...rest,
      item: { id: itemId},
      list: { id: listId}
    })
    await this.listItemRepository.save(newList);;
    return this.findOne(newList.id);
  }

  async findAll(list: List, paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<ListItem[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;
    const queryBuilder = this.listItemRepository.createQueryBuilder()
    .where('"listId" =:listId', { listId: list.id})
    .take(limit)
    .skip(offset);
    
    if(search) {
      queryBuilder.andWhere("LOWER(name) like :name", { name: `%${ search.toLowerCase() }%`})
    }

    return await queryBuilder.getMany();
  }

  async findOne(id: string): Promise<ListItem> {
    const listItem = await this.listItemRepository.findOneBy({id})
    if(!listItem) {
      throw new BadRequestException(`List item ${ id} does not exist`);
    }

    return listItem;
  }

  async update(id: string, updateListItemInput: UpdateListItemInput): Promise<ListItem> {
    const { listId, itemId, ...rest } = updateListItemInput;
    const queryBuilder = this.listItemRepository.createQueryBuilder()
    .update()
    .set(rest)
    .where('id =:id', { id });
    
    if(listId) queryBuilder.set({ list: { id: listId }});
    if(itemId) queryBuilder.set({ item: { id: itemId }});

    await queryBuilder.execute();

    const listItem = await this.findOne(id);
    
    return listItem;
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }

  async countItemListByList(list: List): Promise<number> {
    return await this.listItemRepository.count({
      where: {
        list: {
          id: list.id
        }
      }
    })
  }
}
