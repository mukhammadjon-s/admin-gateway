import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { JwtPayloadWithRt } from 'src/users/types/jwtPayloadWithRt.type';
import { JwtPayloadWithRt } from '../../../user/types/jwtPayloadWithRt.type';

export const CurrentUserRt = createParamDecorator(
  (data: keyof JwtPayloadWithRt | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);
