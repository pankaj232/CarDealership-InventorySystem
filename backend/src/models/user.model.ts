import mongoose, { Document, Schema } from 'mongoose';
import { IUser, UserRole } from '../interfaces/user.interface';

export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'] as UserRole[],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUserDocument>('User', userSchema);

export default User;
