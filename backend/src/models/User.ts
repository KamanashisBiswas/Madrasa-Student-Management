import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'PRINCIPAL' | 'TEACHER';
export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  refreshTokens: string[];
  refId?: mongoose.Types.ObjectId; // Reference to Teacher model
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: ['PRINCIPAL', 'TEACHER'] },
    status: { type: String, required: true, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
    refreshTokens: [{ type: String }],
    refId: { type: Schema.Types.ObjectId },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
