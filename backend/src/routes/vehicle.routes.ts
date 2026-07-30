import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/authorization.middleware';
import {
  createAddVehicleService,
  createDeleteVehicleService,
  createListVehiclesService,
  createPurchaseService,
  createRestockService,
  createSearchVehiclesService,
  createUpdateVehicleService,
} from '../services/vehicle.factory';

const router = Router();
const vehicleController = new VehicleController(
  createAddVehicleService(),
  createListVehiclesService(),
  createSearchVehiclesService(),
  createUpdateVehicleService(),
  createDeleteVehicleService(),
  createPurchaseService(),
  createRestockService()
);

router.get('/', vehicleController.listVehicles);
router.get('/search', vehicleController.searchVehicles);
router.post('/', authenticate, vehicleController.addVehicle);
router.post('/:id/purchase', authenticate, vehicleController.purchaseVehicle);
router.post(
  '/:id/restock',
  authenticate,
  authorizeRoles('admin'),
  vehicleController.restockVehicle
);
router.put('/:id', authenticate, vehicleController.updateVehicle);
router.delete(
  '/:id',
  authenticate,
  authorizeRoles('admin'),
  vehicleController.deleteVehicle
);

export default router;
