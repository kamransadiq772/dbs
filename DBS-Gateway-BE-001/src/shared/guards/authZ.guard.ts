import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientRMQ } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SERVICE } from '../../constants';

@Injectable()
export class AuthZGuard implements CanActivate {
  private readonly logger = new Logger('AuthZGuard');
  constructor(
    private reflector: Reflector,
    @Inject(SERVICE.USER_ACCOUNT) private permissionClient: ClientRMQ,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authorizedOnly = this.reflector.get<boolean>(
      'authorizedOnly',
      context.getHandler(),
    );

    const permissionName = this.reflector.get<boolean>(
      'permissionName',
      context.getHandler(),
    );

    console.log(permissionName, "authZ")
    if (!authorizedOnly) {
      return true;
    }
    try {

      const userId = context.switchToHttp().getRequest()?.user?.userId;
      const label = permissionName

      const checkPermission = await firstValueFrom(
        this.permissionClient.send('check_permission_roles', {
          userId,
          label
        }),
      );

      this.logger.debug(checkPermission)

      this.logger.log('info', userId)
      return checkPermission;
    } catch (err) {
      throw new ForbiddenException();
    }
  }
}
