import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Patient } from '../schemas/patient.schema';

const AuthUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const patient = request.user as Patient;
  patient.password = undefined;
  return patient;
});

export default AuthUser;
