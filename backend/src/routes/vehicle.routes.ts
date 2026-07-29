import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';
import { authenticate } from '../middleware/auth.middleware';
import { createAddVehicleService } from '../services/add-vehicle.factory';

const router = Router();
const vehicleController = new VehicleController(createAddVehicleService());

router.post('/', authenticate, vehicleController.addVehicle);

export default router;
