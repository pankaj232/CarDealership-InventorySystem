import { CreateVehicleData } from './vehicle-repository.interface';

export interface IVehicleValidator {
  validate(input: CreateVehicleData): void;
}
