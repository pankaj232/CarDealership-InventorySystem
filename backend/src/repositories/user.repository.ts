import User, { IUserDocument } from '../models/user.model';
import {
  CreateUserData,
  IUserRepository,
  PersistedUser,
} from '../interfaces/user-repository.interface';

const toPersistedUser = (doc: IUserDocument): PersistedUser => ({
  id: doc._id.toString(),
  name: doc.name,
  email: doc.email,
  password: doc.password,
  role: doc.role,
  createdAt: doc.createdAt as Date,
  updatedAt: doc.updatedAt as Date,
});

export class MongooseUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<PersistedUser | null> {
    const user = await User.findOne({ email: email.toLowerCase() });
    return user ? toPersistedUser(user) : null;
  }

  async create(data: CreateUserData): Promise<PersistedUser> {
    const user = await User.create({
      ...data,
      email: data.email.toLowerCase(),
    });
    return toPersistedUser(user);
  }
}
