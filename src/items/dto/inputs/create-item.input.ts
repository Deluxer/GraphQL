import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateItemInput {
  
  @Field( () => String )
  @IsString()
  @IsNotEmpty()
  name: string;

  // @Field( () => Float )
  // @IsPositive()
  // @Min(0)
  // quantity: number;

  @Field( () => String, { nullable: true } )
  @IsString()
  @IsOptional()
  quantityUnits?: string;
}
