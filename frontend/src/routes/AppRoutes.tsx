import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import Login from '../Pages/Auth/Login';
import Signup from '../Pages/Auth/Signup';
import MainLayout from '../components/Layout/Main-Layout';
import Dashboard from '../Pages/Dash-board';
import GenerateOrder from '../Pages/Orders/Generate-Order';
import OrderHistory from '../Pages/Orders/Order-History';
import ProtectedRoute from './Private-routes';
import HomePage from '../Pages/Home';
import AddProduct from '../Pages/product/Addproduct';
import RestockPage from '../Pages/product/RestockPage';



const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Suspense fallback={<div>Loading...</div>}>
                <HomePage />
              </Suspense>
            </MainLayout>
          </ProtectedRoute>
        }
      />

<Route
  path="/add-product"
  element={
    <ProtectedRoute>
      <MainLayout>
        <AddProduct />
      </MainLayout>
    </ProtectedRoute>
  }
      />
      
      <Route
  path="/restock"
  element={
    <ProtectedRoute>
      <MainLayout>
        <RestockPage />
      </MainLayout>
    </ProtectedRoute>
  }
/>















      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Suspense fallback={<div>Loading...</div>}>
                <Dashboard />
              </Suspense>
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/generate-order"
        element={
          <ProtectedRoute>
            <MainLayout>
              <GenerateOrder />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/order-history"
        element={
          <ProtectedRoute>
            <MainLayout>
              <OrderHistory />
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
