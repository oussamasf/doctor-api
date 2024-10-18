import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AppointmentDocument = HydratedDocument<Appointment>;

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Appointment {
  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  doctorId: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true })
  reason: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
