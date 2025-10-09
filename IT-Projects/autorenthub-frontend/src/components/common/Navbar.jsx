import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActivePage = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { name: 'Home', path: '/', public: true },
    { name: 'Vehicles', path: '/vehicles', public: true },
    { name: 'My Bookings', path: '/my-bookings', private: true },
    { name: 'Dashboard', path: '/userdashboard', private: true },
  ];

  const adminLinks = [
    { name: 'Admin', path: '/admindashboard', admin: true },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200/60 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-blue-600">
                AutoRentHub
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              if (link.private && !user) return null;
              if (link.name === 'Dashboard' && user?.userType === 'admin') return null;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActivePage(link.path)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {user && (user.userType === 'admin' || user.userType === 'staff') && adminLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActivePage(link.path)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* ✅ WRAPPED PROFILE ICON AND NAME IN A LINK */}
                <Link
                  to="/userdashboard/profile"
                  className="flex items-center space-x-2 p-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium text-sm">{user.name}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-blue-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200/70 bg-white/95 backdrop-blur">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link) => {
              if (link.private && !user) return null;
              if (link.name === 'Dashboard' && user?.userType === 'admin') return null;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                    isActivePage(link.path)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {user && (user.userType === 'admin' || user.userType === 'staff') && adminLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                  isActivePage(link.path)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="mt-3 border-t border-gray-200/70 pt-3">
              {user ? (
                <div className="flex items-center justify-between">
                  <Link
                    to="/userdashboard/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 rounded-md p-2 hover:bg-gray-100"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="rounded-md bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full rounded-md px-3 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="w-full rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
