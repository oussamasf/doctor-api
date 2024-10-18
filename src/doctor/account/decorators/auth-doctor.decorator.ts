import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Doctor } from '../schemas/doctor.schema';

const AuthUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const doctor = request.user as Doctor;
  doctor.password = undefined;
  return doctor;
});

export default AuthUser;
