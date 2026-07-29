import { NextFunction, Request, Response } from 'express';
import { VehicleCategory } from '../interfaces/vehicle.interface';
import { AddVehicleService } from '../services/add-vehicle.service';
import { DeleteVehicleService } from '../services/delete-vehicle.service';
import { ListVehiclesService } from '../services/list-vehicles.service';
import { PurchaseService } from '../services/purchase.service';
import { SearchVehiclesService } from '../services/search-vehicles.service';
import { UpdateVehicleService } from '../services/update-vehicle.service';

export class VehicleController {
  constructor(
    private readonly addVehicleService: AddVehicleService,
    private readonly listVehiclesService: ListVehiclesService,
    private readonly searchVehiclesService: SearchVehiclesService,
    private readonly updateVehicleService: UpdateVehicleService,
    private readonly deleteVehicleService: DeleteVehicleService,
    private readonly purchaseService: PurchaseService
  ) {}

  addVehicle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const vehicle = await this.addVehicleService.addVehicle({
        make: req.body?.make ?? '',
        model: req.body?.model ?? '',
        category: req.body?.category ?? '',
        price: req.body?.price,
        quantity: req.body?.quantity,
      });

      res.status(201).json(vehicle);
    } catch (error) {
      next(error);
    }
  };

  listVehicles = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);
      const vehicles = await this.listVehiclesService.list({
        page: Number.isInteger(page) && page > 0 ? page : undefined,
        limit: Number.isInteger(limit) && limit > 0 ? limit : undefined,
      });

      res.status(200).json(vehicles);
    } catch (error) {
      next(error);
    }
  };

  searchVehicles = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const vehicles = await this.searchVehiclesService.search({
        make: typeof req.query.make === 'string' ? req.query.make : undefined,
        model:
          typeof req.query.model === 'string' ? req.query.model : undefined,
        category:
          typeof req.query.category === 'string'
            ? (req.query.category as VehicleCategory)
            : undefined,
        minPrice:
          typeof req.query.minPrice === 'string'
            ? Number(req.query.minPrice)
            : undefined,
        maxPrice:
          typeof req.query.maxPrice === 'string'
            ? Number(req.query.maxPrice)
            : undefined,
      });

      res.status(200).json(vehicles);
    } catch (error) {
      next(error);
    }
  };

  updateVehicle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const vehicle = await this.updateVehicleService.update(
        req.params.id as string,
        {
          make: req.body?.make ?? '',
          model: req.body?.model ?? '',
          category: req.body?.category ?? '',
          price: req.body?.price,
          quantity: req.body?.quantity,
        }
      );

      res.status(200).json(vehicle);
    } catch (error) {
      next(error);
    }
  };

  deleteVehicle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.deleteVehicleService.delete(req.params.id as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  purchaseVehicle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const vehicle = await this.purchaseService.purchase(
        req.params.id as string
      );
      res.status(200).json(vehicle);
    } catch (error) {
      next(error);
    }
  };
}
