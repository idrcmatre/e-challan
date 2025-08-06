// frontend/src/components/Navbar.jsx - BEAUTIFUL VERSION
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Brand */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">E</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">E-Challan</h1>
                                <p className="text-xs text-gray-500">Traffic Management</p>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {user ? (
                                <>
                                    <Link
                                        to="/dashboard"
                                        className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                    >
                                        <span className="mr-2">📊</span>
                                        Dashboard
                                    </Link>

                                    <Link
                                        to="/challans"
                                        className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                    >
                                        <span className="mr-2">{user.role === 'officer' ? '📝' : '🚗'}</span>
                                        {user.role === 'officer' ? 'Manage Challans' : 'My Challans'}
                                    </Link>

                                    {user.role === 'citizen' && (
                                        <Link
                                            to="/payments"
                                            className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                        >
                                            <span className="mr-2">💳</span>
                                            Payments
                                        </Link>
                                    )}

                                    <Link
                                        to="/profile"
                                        className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                    >
                                        <span className="mr-2">👤</span>
                                        Profile
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* User Menu */}
                    {user && (
                        <div className="hidden md:block">
                            <div className="ml-4 flex items-center md:ml-6">
                                {/* User Info */}
                                <div className="flex items-center space-x-3">
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500 capitalize">
                                            {user.role === 'citizen' ? '🚗 Citizen' : '👮‍♂️ Officer'}
                                        </p>
                                    </div>

                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        className="ml-3 px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center"
                                    >
                                        <span className="mr-1">🚪</span>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isMobileMenuOpen ? (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t">
                        {user ? (
                            <>
                                <div className="px-3 py-2 border-b border-gray-200 mb-2">
                                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                </div>

                                <Link
                                    to="/dashboard"
                                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <span className="mr-3">📊</span>
                                    Dashboard
                                </Link>

                                <Link
                                    to="/challans"
                                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <span className="mr-3">{user.role === 'officer' ? '📝' : '🚗'}</span>
                                    {user.role === 'officer' ? 'Manage Challans' : 'My Challans'}
                                </Link>

                                {user.role === 'citizen' && (
                                    <Link
                                        to="/payments"
                                        className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <span className="mr-3">💳</span>
                                        Payments
                                    </Link>
                                )}

                                <Link
                                    to="/profile"
                                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <span className="mr-3">👤</span>
                                    Profile
                                </Link>

                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    <span className="mr-3">🚪</span>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;