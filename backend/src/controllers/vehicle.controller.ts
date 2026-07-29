import { NextFunction, Request, Response } from 'express';
import { AddVehicleService } from '../services/add-vehicle.service';

export class VehicleController {
  constructor(private readonly addVehicleService: AddVehicleService) {}

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
}
