import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks";
import { logoutUser } from "../features/user/UserSlice";

const AdminNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const navLinks = [
    { name: "Dashboard", href: "/adminDashboard" },
    { name: "Users", href: "/adminDashboard/userPage" },
    { name: "Transactions", href: "/adminDashboard/transactions" },
    { name: "Settings", href: "/adminDashboard/settings" },
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white border-b border-yellow-500 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
         <img
            src="/brokers-logo.png"
            alt="Barick Gold Logo"
            className="w-28 object-contain"
          />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="relative font-medium transition duration-200 hover:text-yellow-400"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-yellow-400 transition-all duration-300 hover:w-full"></span>
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="ml-4 bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-black font-bold px-4 py-2 rounded-lg shadow-md transition"
          >
            Logout
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            <FaBars className="text-2xl text-yellow-400" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black text-white px-4 pb-4 space-y-1 border-t border-yellow-500">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="block w-full py-2 px-2 rounded hover:bg-yellow-600 hover:text-black transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="block w-full text-left py-2 px-2 bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-black font-bold rounded transition-all duration-200"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
