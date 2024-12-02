import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import Login from '../pages/auth/login';
import Signup from '../pages/auth/signup';
import MainLayout from '../components/layout/main-layout';
import Dashboard from '../pages/dash-board';
import GenerateOrder from '../pages/orders/generate-order';
import OrderHistory from '../pages/orders/order-history';
import ProtectedRoute from './Private-routes';
import HomePage from '../pages/home';
import AddProduct from '../pages/product/add-product';
import RestockPage from '../pages/product/restock-page';
import AdminRoute from '../routes/admin-route';
import EditProduct from '../pages/product/edit-product';



const AppRoutes = () => {
  const isAuthenticated = localStorage.getItem('token');
  return (
    <Routes>
      {/* <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} /> */}

<Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />} 
      />
      <Route 
        path="/signup" 
        element={isAuthenticated ? <Navigate to="/home" replace /> : <Signup />} 
      />

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
    <AdminRoute>
      <MainLayout>
        <AddProduct />
      </MainLayout>
    </AdminRoute>
    </ProtectedRoute>
  }
      />

  
      
      <Route
  path="/restock"
  element={
    <ProtectedRoute>
      <AdminRoute>
      <MainLayout>
        <RestockPage />
        </MainLayout>
       </AdminRoute>
    </ProtectedRoute>
  }
 />


      

<Route
  path="/edit-product/:id"
  element={
    <ProtectedRoute>
    <AdminRoute>
      <MainLayout>
        <EditProduct />
        </MainLayout>
        </AdminRoute>
   
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
