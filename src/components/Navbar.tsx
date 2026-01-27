// src/components/Navbar.tsx
import React, { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks";
import { logoutUser } from "../features/user/UserSlice";

const Navbar: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Get user from Redux
  const user = useAppSelector((state) => state.userState.user);

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  const handleLogout = () => {
    dispatch(logoutUser()); // Redux action
    localStorage.removeItem("user"); // Clear persisted user
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 font-sans border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img
            src="/brokers-logo.png"
            alt="Barick Gold Logo"
            className="w-28 object-contain"
          />
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-gray-700 items-center text-[15px] font-medium">
          <li>
            <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-blue-600 transition">About</Link>
          </li>
          <li>
            <Link to="/services" className="hover:text-blue-600 transition">Services</Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-blue-600 transition">Contact</Link>
          </li>

          {user ? (
            <>
              <li>
                <Link to="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition font-semibold shadow-sm"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition font-semibold shadow-sm"
              >
                Sign In
              </Link>
            </li>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobile}
          className="md:hidden text-gray-700 text-2xl focus:outline-none"
        >
          {isMobileOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-100">
          <ul className="text-gray-700 text-sm font-medium">
            <li>
              <Link to="/" className="block px-4 py-3 hover:bg-gray-50" onClick={toggleMobile}>Home</Link>
            </li>
            <li>
              <Link to="/about" className="block px-4 py-3 hover:bg-gray-50" onClick={toggleMobile}>About</Link>
            </li>
            <li>
              <Link to="/services" className="block px-4 py-3 hover:bg-gray-50" onClick={toggleMobile}>Services</Link>
            </li>
            <li>
              <Link to="/contact" className="block px-4 py-3 hover:bg-gray-50" onClick={toggleMobile}>Contact</Link>
            </li>

            {user ? (
              <>
                <li>
                  <Link to="/dashboard" className="block px-4 py-3 hover:bg-gray-50" onClick={toggleMobile}>Dashboard</Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMobile();
                    }}
                    className="block w-full text-left bg-red-500 text-white px-4 py-3 hover:bg-red-600"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="block w-full text-left bg-blue-600 text-white px-4 py-3 hover:bg-blue-700"
                  onClick={toggleMobile}
                >
                  Sign In
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
