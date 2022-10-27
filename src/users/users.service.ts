import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotAcceptableException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpInputDto } from 'src/auth/dto/input/signup.unput';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { List } from 'src/list/entities/list.entity';

@Injectable()
export class UsersService {

  private logger = new Logger('UserService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(signupInput: SignUpInputDto): Promise<User> {

    try {
      
      const newUser = this.userRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10)
      });
      return await this.userRepository.save(newUser);

    } catch (error) {
      this.handleDBErros(error);
    }
  }

  async findAll(roles: ValidRoles[]): Promise<User[]> {
    if ( roles.length === 0 ) return await this.userRepository.find({
      // relations: {
      //   updatedBy: true
      // }
    });
    const users = await this.userRepository.createQueryBuilder()
    .andWhere('ARRAY[roles] && ARRAY[:...roles]')
    .setParameter('roles', roles)
    .getMany();

    return users;
  }

  async findByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ email })
    } catch (error) {
      this.handleDBErros({
        code: 'error-01',
        detail: `Error ${ email } not found`
      })
    }
  }

  async update(
    id: string, updateUserInput: UpdateUserInput, userUpdateBy: User
  ): Promise<User> {
    
    try {
      const user = await this.userRepository.preload({
        ...updateUserInput,
        id
      });
      user.updatedBy = userUpdateBy;
      return await this.userRepository.save(user);
    } catch (error) {
      this.handleDBErros(error);
    }  
  }

  async block(id: string, adminUser: User): Promise<User> {
    const userToBlock = await this.findById(id);
    userToBlock.isActive = false;
    userToBlock.updatedBy = adminUser;
    return await this.userRepository.save(userToBlock);
  }

  async findById(id: string ): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({id})
    } catch (error) {
      throw new  NotFoundException(`Error, The ${ id } not found`)
    }
  }
  
  private handleDBErros(error: any): never {
    this.logger.error( error );
    if ( error.code === '23505' ) throw new BadRequestException(error.detail.replace('key ', ''))
    if ( error.code === 'error-01' ) throw new NotAcceptableException(error.detail)
    
    throw new InternalServerErrorException('Please check server logs');
  }
}
