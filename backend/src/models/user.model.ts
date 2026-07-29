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

userSchema.index({ email: 1 }, { unique: true });

userSchema.path('email').validate({
  validator: async function (value: string) {
    if (!this.isModified('email')) {
      return true;
    }

    const UserModel = this.constructor as mongoose.Model<IUserDocument>;
    const existing = await UserModel.findOne({ email: value });

    if (!existing) {
      return true;
    }

    return existing._id.equals(this._id);
  },
  message: 'Email already exists',
});

const User = mongoose.model<IUserDocument>('User', userSchema);

export default User;
