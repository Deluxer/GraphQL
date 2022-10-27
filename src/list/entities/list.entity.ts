import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Lists' })
@ObjectType()
export class List {

  @PrimaryGeneratedColumn('uuid')
  @Field( () => ID)
  id: string;

  @Field( () => String)
  @Column()
  name: string;

  @ManyToOne( () => User, (user) => user.lists, { nullable: false, lazy: true } )
  @Index('userId-list-Index')
  @Field( () => User )
  user: User

  @OneToMany( () => ListItem, (listItem) => listItem.list, { lazy: true } )
  @Field( () => [ListItem] )
  listItem: ListItem[];
}
