import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RolesEnum } from '../../../user/enums';

export const ValidateMerchantCompany = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.user && request.user.role === RolesEnum.MERCHANT) {
      if (request.body?.companyId && request?.body?.companyId != request.user?.companyId) {
        throw new Error('Incorrect company')
      }
    }
    return true;
  },
);
