import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import Login from '../Pages/auth/Llogin';
import Signup from '../Pages/auth/Signup';
import MainLayout from '../components/Layout/Main-Layout';
import Dashboard from '../Pages/dash-board';
import GenerateOrder from '../Pages/orders/Generate-Order';
import OrderHistory from '../Pages/orders/Order-History';
import ProtectedRoute from './Private-routes';
import HomePage from '../Pages/home';
import AddProduct from '../Pages/product/add-product';
import RestockPage from '../Pages/product/restock-page';
import AdminRoute from './admin-routes';
import EditProduct from '../Pages/product/edit-product';


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
