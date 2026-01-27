import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAppSelector } from "../hooks";
import { formatter } from "../utils/utils";

const productionUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:7000/api"
    : "https://brokers-backend-hbq6.onrender.com/api";

interface UserIn {
  fullName: string;
  email: string;
}

interface InvestmentIn {
  _id: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  user: UserIn;
}

interface Investment {
  investment: InvestmentIn;
  amount: number;
  durationType: string;
  durationValue: number;
  status: string;
  createdAt: string;
}

const ViewInvestment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const user = useAppSelector((state) => state.userState.user);
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInvestment = async () => {
      if (!id) return;
      try {
        const res = await axios.get(`${productionUrl}/investment/${id}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setInvestment(res.data);
      } catch (err) {
        setError("Failed to load investment details");
      } finally {
        setLoading(false);
      }
    };
    fetchInvestment();
  }, [id, user?.token]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <span className="loading loading-ring loading-lg text-yellow-400"></span>
      </div>
    );

  if (error)
    return (
      <p className="text-center text-red-500 font-semibold mt-6">{error}</p>
    );

  if (!investment)
    return (
      <p className="text-center text-gray-400 mt-6">No investment found</p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-800 bg-opacity-80 backdrop-blur-lg border border-yellow-500/30 rounded-2xl shadow-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-yellow-400 tracking-wide">
          💰 Investment Details
        </h2>

        <div className="space-y-4 text-gray-200">
          <p>
            <span className="text-yellow-300 font-semibold">User:</span>{" "}
            {investment.investment.user.fullName} (
            {investment.investment.user.email})
          </p>
          <p>
            <span className="text-yellow-300 font-semibold">Amount:</span>{" "}
            {formatter.format(investment.investment.amount)}
          </p>
          <p>
            <span className="text-yellow-300 font-semibold">Duration:</span>{" "}
            {investment.investment.durationValue}
            {investment.durationType}
          </p>
          <p>
            <span className="text-yellow-300 font-semibold">Status:</span>{" "}
            <span
              className={`px-2 py-1 rounded ${
                investment.investment.status === "active"
                  ? "bg-green-600 text-white"
                  : "bg-red-600 text-white"
              }`}
            >
              {investment.investment.status}
            </span>
          </p>
          <p>
            <span className="text-yellow-300 font-semibold">Date:</span>{" "}
            {new Date(investment.investment.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewInvestment;
