import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type PatientDocument = HydratedDocument<Patient>;

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Patient {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop()
  address: string;

  @Prop({ type: [{ type: String }] })
  doctors: string[]; // Array of doctor IDs

  @Prop({ type: [{ type: String }] })
  appointments: string[]; // Array of appointment IDs

  @Prop({ type: [{ type: String }] })
  prescriptions: string[]; // Array of prescription IDs

  @Prop({ type: [{ type: String }] })
  medicalHistory: string[]; // Array of medical history IDs

  @Prop()
  refreshToken?: string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);

PatientSchema.pre('save', async function (next) {
  const { CRYPTO_SALT_ROUNDS } = process.env;
  const agent = this as Patient;

  try {
    const hashedPassword = await bcrypt.hash(
      agent.password,
      parseInt(`${CRYPTO_SALT_ROUNDS}`),
    );
    agent.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});
