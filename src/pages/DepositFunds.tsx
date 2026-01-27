// src/pages/DepositFunds.tsx
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { useEffect } from "react";

const DepositFunds: React.FC = () => {
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
          <h1 className="text-2xl font-bold text-yellow-400 mb-6">Deposit Funds</h1>
      <p className="text-gray-300 mb-4">
        Add funds to your investment account and start growing your portfolio in gold and cryptocurrency.
        Choose a deposit method that suits you — from secure bank transfers to blockchain-based payments.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Bank Transfer */}
        <Link
          to="/bankTransfer"
          className="bg-gray-800 border border-yellow-500 p-6 rounded shadow hover:shadow-yellow-500/40 transition cursor-pointer"
        >
          <h3 className="text-lg font-semibold text-yellow-300 mb-2">Bank Transfer</h3>
          <p className="text-sm text-gray-300">
            Securely transfer funds into your account. Gold-backed deposits may take 1–2 business days.
          </p>
        </Link>

        {/* Cryptocurrency */}
        <Link
          to="/cryptoPage"
          className="bg-gray-800 border border-yellow-500 p-6 rounded shadow hover:shadow-yellow-500/40 transition"
        >
          <h3 className="text-lg font-semibold text-yellow-300 mb-2">Cryptocurrency</h3>
          <p className="text-sm text-gray-300">
            Deposit with Bitcoin (BTC), Ethereum (ETH), or Tether (USDT). Blockchain confirmations apply.
          </p>
        </Link>
      </div>
      </div>
    
    </div>
  );
};

export default DepositFunds;
