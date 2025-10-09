// src/components/layout/MainLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar'; // Adjust path if needed
import Footer from '../common/Footer'; // Adjust path if needed

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        {/* The Outlet component renders the actual page component (e.g., Home, Login) */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;