import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    try {
      super.canActivate(context)
    }
    catch (e) {
    }
    return true;
  }

  handleRequest(err, user, info, context, status) {
    return user;
  }
}
