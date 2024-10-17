import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type StaffDocument = HydratedDocument<Staff>;

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Staff {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: [String], required: true })
  roles: string[];

  @Prop()
  refreshToken?: string;
}

export const StaffSchema = SchemaFactory.createForClass(Staff);

StaffSchema.pre('save', async function (next) {
  const { CRYPTO_SALT_ROUNDS } = process.env;
  const admin = this as Staff;

  try {
    const hashedPassword = await bcrypt.hash(
      admin.password,
      parseInt(`${CRYPTO_SALT_ROUNDS}`),
    );
    admin.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});
