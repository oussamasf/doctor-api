import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import { Types } from 'mongoose';

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
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;

  @Prop()
  phoneNumber: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop()
  address?: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId }] })
  doctors?: Types.ObjectId[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId }] })
  appointments?: Types.ObjectId[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId }] })
  prescriptions?: Types.ObjectId[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId }] })
  medicalHistory?: Types.ObjectId[];

  @Prop()
  refreshToken?: string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);

PatientSchema.pre('save', async function (next) {
  const { CRYPTO_SALT_ROUNDS } = process.env;
  const user = this as Patient;

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
