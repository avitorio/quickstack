import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users/users.service';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '../../users/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const request = GqlExecutionContext.create(context);

    const ctxUser: User = request.getContext().req.user;

    const user = await this.userService.findOne(ctxUser.id);

    const hasRole = () => roles.indexOf(user.role) > -1;

    let hasPermission = false;

    if (hasRole()) {
      hasPermission = true;
    }

    return user && hasPermission;
  }
}
