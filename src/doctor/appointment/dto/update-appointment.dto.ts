import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends PartialType(
  OmitType(CreateAppointmentDto, [] as const),
) {}

export class UpdateAppointmentByDoctorDto extends PartialType(
  OmitType(CreateAppointmentDto, ['doctorId'] as const),
) {}
