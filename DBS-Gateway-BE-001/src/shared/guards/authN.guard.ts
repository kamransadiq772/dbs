import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientRMQ } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SERVICE } from '../../constants';

@Injectable()
export class AuthNGuard implements CanActivate {
  private readonly logger = new Logger('AuthNGuard');
  constructor(
    private reflector: Reflector,
    @Inject(SERVICE.USER_ACCOUNT) private authClient: ClientRMQ,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const secured = this.reflector.get<boolean>(
      'authenticatedOnly',
      context.getHandler(),
    );
    if (secured) {
      try {
        const token = this.getToken(context);
        this.logger.debug(token)
        const user = await firstValueFrom(
          this.authClient.send('verify_token', { token }),
        );
        this.logger.debug(user);
        console.log(user)
        this.logger.log('info', user)
        this.appendUser(user, context);
      } catch (err) {
        throw new UnauthorizedException();
      }
    }
    return true;
  }

  private getToken(context: ExecutionContext) {
    let authorization: string;
    if (context.getType() === 'rpc') {
      authorization = context.switchToRpc().getData().authorization;
    } else if (context.getType() === 'http') {
      authorization = context
        .switchToHttp()
        .getRequest()
        .headers?.authorization.replace('Bearer ', '');
    }
    if (!authorization) {
      throw new UnauthorizedException(
        'No value was provided for Authorization',
      );
    }
    return authorization;
  }

  private appendUser(user: any, context: ExecutionContext) {
    if (context.getType() === 'rpc') {
      context.switchToRpc().getData().user = user;
    } else if (context.getType() === 'http') {
      context.switchToHttp().getRequest().user = user;
    }
  }
}
