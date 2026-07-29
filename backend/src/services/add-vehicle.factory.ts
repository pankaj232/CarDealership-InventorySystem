import { MongooseVehicleRepository } from '../repositories/vehicle.repository';
import { VehicleValidator } from '../validators/vehicle.validator';
import { AddVehicleService } from './add-vehicle.service';
import { DeleteVehicleService } from './delete-vehicle.service';
import { ListVehiclesService } from './list-vehicles.service';
import { SearchVehiclesService } from './search-vehicles.service';
import { UpdateVehicleService } from './update-vehicle.service';

export const createAddVehicleService = (): AddVehicleService =>
  new AddVehicleService(
    new MongooseVehicleRepository(),
    new VehicleValidator()
  );

export const createListVehiclesService = (): ListVehiclesService =>
  new ListVehiclesService(new MongooseVehicleRepository());

export const createSearchVehiclesService = (): SearchVehiclesService =>
  new SearchVehiclesService(new MongooseVehicleRepository());

export const createUpdateVehicleService = (): UpdateVehicleService =>
  new UpdateVehicleService(
    new MongooseVehicleRepository(),
    new VehicleValidator()
  );

export const createDeleteVehicleService = (): DeleteVehicleService =>
  new DeleteVehicleService(new MongooseVehicleRepository());
