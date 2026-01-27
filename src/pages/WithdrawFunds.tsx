// src/pages/WithdrawFunds.tsx
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { useEffect } from "react";

const WithdrawFunds: React.FC = () => {
  const user = useAppSelector((state) => state.userState.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-gray-900 via-black to-yellow-900 min-h-screen text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-yellow-400 mb-6">Withdraw Funds</h1>
      <p className="text-gray-300 mb-4">
        Withdraw your earnings anytime — just make sure your account is verified
        and linked to a valid payment method.
      </p>

      <ul className="list-disc pl-5 space-y-2 text-yellow-200">
        <li>💰 Minimum withdrawal: <span className="text-yellow-400">$100</span></li>
        <li>⏳ Processing time: <span className="text-yellow-400">24–72 hours</span></li>
        <li>🏦 Ensure your bank details are correct</li>
        <li>🔑 Crypto withdrawals require wallet address verification</li>
      </ul>

      <div className="mt-8">
        <Link
          to="/withdrawForm"
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 px-6 rounded transition shadow-md hover:shadow-yellow-500/50"
        >
          Proceed
        </Link>
      </div>
      </div>
      
    </div>
  );
};

export default WithdrawFunds;
