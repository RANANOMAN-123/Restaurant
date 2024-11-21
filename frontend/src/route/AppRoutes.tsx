import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import Login from '../components/Login';
import Signup from '../components/Signup';
import MainLayout from '../components/Layout/MainLayout';
import Dashboard from '../components/Dashboard/Dashboard';
import GenerateOrder from '../components/Order/GenerateOrder';
import OrderHistory from '../components/Order/OrderHistory';
import PrivateRoute from './PrivateRoute';
import HomePage from '../components/Home/HomePage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/home"
        element={
          <PrivateRoute>
            <MainLayout>
              <Suspense fallback={<div>Loading...</div>}>
                <HomePage />
              </Suspense>
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <MainLayout>
              <Suspense fallback={<div>Loading...</div>}>
                <Dashboard />
              </Suspense>
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/generate-order"
        element={
          <PrivateRoute>
            <MainLayout>
              <GenerateOrder />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/order-history"
        element={
          <PrivateRoute>
            <MainLayout>
              <OrderHistory />
            </MainLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
