import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBars, FaShoppingCart, FaSignOutAlt, FaTimes, FaUser } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

  if (isAdmin) {
    navLinks.push({ path: '/admin', label: 'Admin' });
  }

  const cartLink = (
    <Link
      to="/cart"
      className="relative inline-flex items-center gap-2 text-gray-700 hover:text-[#2563EB] font-medium transition-colors"
      onClick={() => setIsOpen(false)}
    >
      <FaShoppingCart />
      <span>Cart</span>
      {itemCount > 0 && (
        <span className="absolute -top-3 -right-4 min-w-5 h-5 px-1 rounded-full bg-[#F59E0B] text-white text-xs font-bold flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold text-[#0F172A]"
            >
              Century<span className="text-[#2563EB]">Tech</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-700 hover:text-[#2563EB] font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons / Info */}
          <div className="hidden md:flex items-center gap-4">
            {cartLink}
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2 text-gray-700 font-medium">
                  <FaUser className="text-[#2563EB]" />
                  Hi, {user?.username}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="flex items-center gap-2 bg-[#F59E0B] text-white px-5 py-2 rounded-full font-medium hover:bg-amber-600 transition-colors cursor-pointer"
                >
                  <FaSignOutAlt /> Sign Out
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-[#2563EB] font-medium transition-colors"
                >
                  Sign In
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/signup"
                    className="bg-[#2563EB] text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </motion.button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl text-[#0F172A] cursor-pointer focus:outline-none"
            aria-label="Toggle navigation"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden border-t border-gray-200 py-4 flex flex-col gap-2"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block py-2 text-gray-700 hover:text-[#2563EB]"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="py-2">
              {cartLink}
            </div>
            <div className="border-t border-gray-150 pt-2 mt-2">
              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <span className="flex items-center gap-2 text-gray-700 font-medium py-1">
                    <FaUser className="text-[#2563EB]" />
                    Hi, {user?.username}
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-2 text-[#F59E0B] font-bold py-2"
                  >
                    <FaSignOutAlt /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    to="/login"
                    className="block py-2 text-gray-700 hover:text-[#2563EB]"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block py-2 text-[#2563EB] font-bold"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
