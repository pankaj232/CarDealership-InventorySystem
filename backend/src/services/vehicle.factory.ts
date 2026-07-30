import { MongooseVehicleRepository } from '../repositories/vehicle.repository';
import { VehicleValidator } from '../validators/vehicle.validator';
import { AddVehicleService } from './add-vehicle.service';
import { DeleteVehicleService } from './delete-vehicle.service';
import { ListVehiclesService } from './list-vehicles.service';
import { PurchaseService } from './purchase.service';
import { RestockService } from './restock.service';
import { SearchVehiclesService } from './search-vehicles.service';
import { UpdateVehicleService } from './update-vehicle.service';

const createVehicleRepository = (): MongooseVehicleRepository =>
  new MongooseVehicleRepository();

const createVehicleValidator = (): VehicleValidator => new VehicleValidator();

export const createAddVehicleService = (): AddVehicleService =>
  new AddVehicleService(createVehicleRepository(), createVehicleValidator());

export const createListVehiclesService = (): ListVehiclesService =>
  new ListVehiclesService(createVehicleRepository());

export const createSearchVehiclesService = (): SearchVehiclesService =>
  new SearchVehiclesService(createVehicleRepository());

export const createUpdateVehicleService = (): UpdateVehicleService =>
  new UpdateVehicleService(createVehicleRepository(), createVehicleValidator());

export const createDeleteVehicleService = (): DeleteVehicleService =>
  new DeleteVehicleService(createVehicleRepository());

export const createPurchaseService = (): PurchaseService =>
  new PurchaseService(createVehicleRepository());

export const createRestockService = (): RestockService =>
  new RestockService(createVehicleRepository());
