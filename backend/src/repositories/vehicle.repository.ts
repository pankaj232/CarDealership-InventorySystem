import {
  HydratedDocument,
  isValidObjectId,
  QueryFilter,
  Types,
} from 'mongoose';
import Vehicle from '../models/vehicle.model';
import { IVehicle, VehicleCategory } from '../interfaces/vehicle.interface';
import {
  CreateVehicleData,
  IVehicleRepository,
  PersistedVehicle,
  VehiclePagination,
  VehicleSearchCriteria,
} from '../interfaces/vehicle-repository.interface';

type VehicleRecord = {
  _id: Types.ObjectId;
  make: string;
  model?: string;
  category: VehicleCategory;
  price: number;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
  get?: (path: string) => unknown;
};

const toPersistedVehicle = (
  doc: HydratedDocument<IVehicle> | VehicleRecord
): PersistedVehicle => {
  const modelValue =
    typeof doc.get === 'function'
      ? (doc.get('model') as string)
      : (doc.model as string);

  return {
    id: doc._id.toString(),
    make: doc.make,
    model: modelValue,
    category: doc.category,
    price: doc.price,
    quantity: doc.quantity,
    createdAt: doc.createdAt as Date,
    updatedAt: doc.updatedAt as Date,
  };
};

const exactCaseInsensitive = (value: string): RegExp =>
  new RegExp(`^${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');

export class MongooseVehicleRepository implements IVehicleRepository {
  async create(data: CreateVehicleData): Promise<PersistedVehicle> {
    const vehicle = await Vehicle.create(data);
    return toPersistedVehicle(vehicle);
  }

  async findById(id: string): Promise<PersistedVehicle | null> {
    if (!isValidObjectId(id)) {
      return null;
    }

    const vehicle = await Vehicle.findById(id).lean<VehicleRecord>();
    return vehicle ? toPersistedVehicle(vehicle) : null;
  }

  async findAll(
    pagination: VehiclePagination = {}
  ): Promise<PersistedVehicle[]> {
    const query = Vehicle.find().sort({ _id: 1 }).lean<VehicleRecord[]>();

    if (pagination.page && pagination.limit) {
      query.skip((pagination.page - 1) * pagination.limit);
      query.limit(pagination.limit);
    }

    const vehicles = await query;
    return vehicles.map(toPersistedVehicle);
  }

  async search(criteria: VehicleSearchCriteria): Promise<PersistedVehicle[]> {
    const filter: QueryFilter<IVehicle> = {};

    if (criteria.make) {
      filter.make = exactCaseInsensitive(criteria.make);
    }
    if (criteria.model) {
      filter.model = exactCaseInsensitive(criteria.model);
    }
    if (criteria.category) {
      filter.category = criteria.category;
    }
    if (criteria.minPrice !== undefined || criteria.maxPrice !== undefined) {
      filter.price = {};
      if (criteria.minPrice !== undefined) {
        filter.price.$gte = criteria.minPrice;
      }
      if (criteria.maxPrice !== undefined) {
        filter.price.$lte = criteria.maxPrice;
      }
    }

    const vehicles = await Vehicle.find(filter)
      .sort({ _id: 1 })
      .lean<VehicleRecord[]>();
    return vehicles.map(toPersistedVehicle);
  }

  async update(
    id: string,
    data: CreateVehicleData
  ): Promise<PersistedVehicle | null> {
    if (!isValidObjectId(id)) {
      return null;
    }

    const vehicle = await Vehicle.findByIdAndUpdate(id, data, {
      returnDocument: 'after',
      runValidators: true,
    });
    return vehicle ? toPersistedVehicle(vehicle) : null;
  }

  async decreaseQuantity(id: string): Promise<PersistedVehicle | null> {
    if (!isValidObjectId(id)) {
      return null;
    }

    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: id, quantity: { $gt: 0 } },
      { $inc: { quantity: -1 } },
      { returnDocument: 'after' }
    );

    return vehicle ? toPersistedVehicle(vehicle) : null;
  }

  async increaseQuantity(
    id: string,
    amount: number
  ): Promise<PersistedVehicle | null> {
    if (!isValidObjectId(id)) {
      return null;
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      { $inc: { quantity: amount } },
      { returnDocument: 'after' }
    );

    return vehicle ? toPersistedVehicle(vehicle) : null;
  }

  async delete(id: string): Promise<boolean> {
    if (!isValidObjectId(id)) {
      return false;
    }

    const vehicle = await Vehicle.findByIdAndDelete(id);
    return vehicle !== null;
  }
}
