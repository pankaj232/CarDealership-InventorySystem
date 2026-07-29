import { MongooseVehicleRepository } from '../repositories/vehicle.repository';
import { VehicleValidator } from '../validators/vehicle.validator';
import { AddVehicleService } from './add-vehicle.service';

export const createAddVehicleService = (): AddVehicleService =>
  new AddVehicleService(
    new MongooseVehicleRepository(),
    new VehicleValidator()
  );
