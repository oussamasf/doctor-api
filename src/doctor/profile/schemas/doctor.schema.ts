import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import { Patient } from 'src/patient/account/schemas/patient.schema';

export type DoctorDocument = HydratedDocument<Doctor>;

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Doctor {
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
  specialization: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId }] })
  patients: Patient[];

  @Prop({ type: [{ type: String }] })
  appointments: string[];

  @Prop()
  refreshToken?: string;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);

DoctorSchema.pre('save', async function (next) {
  const { CRYPTO_SALT_ROUNDS } = process.env;
  const user = this as Doctor;

  try {
    const hashedPassword = await bcrypt.hash(
      user.password,
      parseInt(`${CRYPTO_SALT_ROUNDS}`),
    );
    user.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});
