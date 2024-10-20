import * as bcrypt from 'bcrypt';

export async function isPasswordReused(
  newPassword: string,
  oldPassword: string,
): Promise<boolean> {
  if (await bcrypt.compare(newPassword, oldPassword)) return true;
  return false;
}
