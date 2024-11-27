// import { Routes, Route, Navigate } from 'react-router-dom';
// import { Suspense } from 'react';
// import Login from '../Login';
// import Signup from '../sign-up';
// import MainLayout from '../Layout';
// import Dashboard from '../Dash-board';
// import GenerateOrder from '../Generate-Order';
// import OrderHistory from '../Order-History';
// import PrivateRoute from '../Private-routes';
// import HomePage from '../Home';
// import AddProduct from '../product/Addproduct';
// import RestockPage  from '../Re-Stock/RestockPage';

import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import Login from '../Login/index';
import Signup from '../sign-up/index';
import MainLayout from '../Layout/index';
import Dashboard from '../Dash-board/index';
import GenerateOrder from '../Generate-Order/index';
import OrderHistory from '../Order-History/index';
import PrivateRoute from '../Private-routes/index';
import AdminRoute from '../Admin-Route/index';
import HomePage from '../Home/index';
import AddProduct from '../product/Addproduct';
import RestockPage from '../Re-Stock/RestockPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/home" element={
                <PrivateRoute>
                    <MainLayout>
                        <Suspense fallback={<div>Loading...</div>}>
                            <HomePage />
                        </Suspense>
                    </MainLayout>
                </PrivateRoute>
            } />

            <Route path="/dashboard" element={
                <PrivateRoute>
                    <MainLayout>
                        <Suspense fallback={<div>Loading...</div>}>
                            <Dashboard />
                        </Suspense>
                    </MainLayout>
                </PrivateRoute>
            } />

            <Route path="/add-product" element={
                <PrivateRoute>
                    <AdminRoute>
                        <MainLayout>
                            <AddProduct />
                        </MainLayout>
                    </AdminRoute>
                </PrivateRoute>
            } />

            <Route path="/restock" element={
                <PrivateRoute>
                    <AdminRoute>
                        <MainLayout>
                            <RestockPage />
                        </MainLayout>
                    </AdminRoute>
                </PrivateRoute>
            } />

            <Route path="/generate-order" element={
                <PrivateRoute>
                    <MainLayout>
                        <GenerateOrder />
                    </MainLayout>
                </PrivateRoute>
            } />

            <Route path="/order-history" element={
                <PrivateRoute>
                    <MainLayout>
                        <OrderHistory />
                    </MainLayout>
                </PrivateRoute>
            } />
        </Routes>
    );
};

export default AppRoutes;
