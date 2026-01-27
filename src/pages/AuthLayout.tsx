import React from "react";

interface Props {
  children: React.ReactNode;
  title: string;
}

const AuthLayout: React.FC<Props> = ({ children, title }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
