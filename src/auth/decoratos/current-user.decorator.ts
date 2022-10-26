import { createParamDecorator, ExecutionContext, ForbiddenException, InternalServerErrorException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { User } from "src/users/entities/user.entity";
import { ValidRoles } from "../enums/valid-roles.enum";

export const CurrentUser = createParamDecorator((roles: ValidRoles[] = [], context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create( context );
    const user: User = ctx.getContext().req.user;
    
    if ( !user ) {
        throw new InternalServerErrorException('No user inside the request - make sure that we used the AuthGuard')
    }

    if(roles.length === 0) return user;
    
    for( const rol of user.roles ) {
        // TODO: delete valid roles
        if( roles.includes( rol as ValidRoles )) {
            return user;
        }
    }
    
    throw new ForbiddenException(`User ${ user.fullName } not authorized`);
}) 