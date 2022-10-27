import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { Item } from 'src/items/entities/item.entity';
import { List } from 'src/list/entities/list.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  
  @PrimaryGeneratedColumn('uuid')
  @Field( () => ID )
  id: string;

  @Field( () => String )
  @Column()
  fullName: string;

  @Field( () => String )
  @Column({ unique: true })
  email: string;

  @Field( () => String)
  @Column()
  password: string;

  @Field( () => [ValidRoles] )
  @Column({
    type: 'text',
    array: true,
    default: ['user']
  })
  roles: string[];

  @Field( () => Boolean) 
  @Column({
    type: 'boolean',
    default: true
  })
  isActive: boolean;
  
  @ManyToOne( () => User, (user) => user.updatedBy, { nullable: true, lazy: true } )
  @JoinColumn({ name: 'updateAt'})
  @Field( () => User, { nullable: true })
  updatedBy?: User;

  @OneToMany( () =>  Item, (item) => item.user, { lazy: true} )
  // @Field( () => [Item])
  items: Item[];

  @OneToMany( () => List, (list) => list.user, { lazy: true } )
  lists: List[]
}
