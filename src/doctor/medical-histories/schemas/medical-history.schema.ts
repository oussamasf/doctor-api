import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MedicalHistoryDocument = MedicalHistory & Document;

@Schema({
  timestamps: true,
})
export class MedicalHistory {
  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  doctorId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Prescription',
    required: true,
    unique: true,
  })
  prescriptionId: Types.ObjectId;

  @Prop({ required: true })
  diagnosis: string;

  @Prop({ required: true })
  treatment: string;

  @Prop({ default: '' })
  notes: string;
}

export const MedicalHistorySchema =
  SchemaFactory.createForClass(MedicalHistory);
