import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { VehicleCreatePage } from '@/pages/admin/VehicleCreatePage';
import { VehicleEditPage } from '@/pages/admin/VehicleEditPage';
import { VehicleManagementPage } from '@/pages/admin/VehicleManagementPage';
import {
  AdminRoute,
  ProtectedRoute,
  PublicOnlyRoute,
} from '@/routes/ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route element={<AdminRoute />}>
          <Route path="/admin/vehicles" element={<VehicleManagementPage />} />
          <Route path="/admin/vehicles/new" element={<VehicleCreatePage />} />
          <Route
            path="/admin/vehicles/:id/edit"
            element={<VehicleEditPage />}
          />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
