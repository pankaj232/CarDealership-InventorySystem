import { HydratedDocument } from 'mongoose';
import Vehicle from '../models/vehicle.model';
import { IVehicle } from '../interfaces/vehicle.interface';
import {
  CreateVehicleData,
  IVehicleRepository,
  PersistedVehicle,
} from '../interfaces/vehicle-repository.interface';

const toPersistedVehicle = (
  doc: HydratedDocument<IVehicle>
): PersistedVehicle => ({
  id: doc._id.toString(),
  make: doc.make,
  model: doc.get('model') as string,
  category: doc.category,
  price: doc.price,
  quantity: doc.quantity,
  createdAt: doc.createdAt as Date,
  updatedAt: doc.updatedAt as Date,
});

export class MongooseVehicleRepository implements IVehicleRepository {
  async create(data: CreateVehicleData): Promise<PersistedVehicle> {
    const vehicle = await Vehicle.create(data);
    return toPersistedVehicle(vehicle);
  }
}
