import React from 'react';
import { Outlet } from 'react-router-dom';
import SideNav from '../Side-Nav';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex bg-gray-100">
      <SideNav />
      <main className="flex-1">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default MainLayout;
