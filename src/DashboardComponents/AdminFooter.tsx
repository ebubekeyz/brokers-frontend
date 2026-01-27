import React from "react";

const AdminFooter: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white border-t border-yellow-500 py-4 mt-6">
      <div className="max-w-6xl mx-auto px-4 text-center text-sm">
        <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent font-semibold">
          © {new Date().getFullYear()} Barick Gold & Crypto Admin
        </span>
        <span className="text-gray-400"> — Empowering Digital & Precious Metal Investments.</span>
      </div>
    </footer>
  );
};

export default AdminFooter;
