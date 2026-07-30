import mongoose, { Schema } from 'mongoose';
import { VEHICLE_CATEGORIES } from '../constants/vehicle.constants';
import { IVehicle } from '../interfaces/vehicle.interface';

const vehicleSchema = new Schema<IVehicle>(
  {
    make: {
      type: String,
      required: [true, 'Make is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [...VEHICLE_CATEGORIES],
        message: `Category must be one of: ${VEHICLE_CATEGORIES.join(', ')}`,
      },
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0.01, 'Price must be greater than 0'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

vehicleSchema.index({ make: 1, model: 1 });
vehicleSchema.index({ category: 1, price: 1 });

const Vehicle = mongoose.model<IVehicle>('Vehicle', vehicleSchema);

export default Vehicle;
