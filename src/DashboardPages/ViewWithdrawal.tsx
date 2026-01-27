import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAppSelector } from "../hooks";
import { formatter } from "../utils/utils";

const productionUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:7000/api"
    : "https://brokers-backend-h2nt.onrender.com/api";

interface UserIn {
  fullName: string;
  email: string;
}

interface WithdrawalIn {
  _id: string;
  amount: number;
  method?: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  user: UserIn;
}

interface Withdrawal {
  withdraw: WithdrawalIn;
  amount: number;
  method?: string;
  status: string;
  createdAt: string;
}

const ViewWithdrawal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [withdrawal, setWithdrawal] = useState<Withdrawal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = useAppSelector((state) => state.userState.user);

  useEffect(() => {
    const fetchWithdrawal = async () => {
      if (!id) return;
      try {
        const res = await axios.get<Withdrawal>(
          `${productionUrl}/withdraws/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        setWithdrawal(res.data);
      } catch (err) {
        setError("Failed to load withdrawal details");
      } finally {
        setLoading(false);
      }
    };
    fetchWithdrawal();
  }, [id, user?.token]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <span className="loading loading-ring loading-lg text-yellow-400"></span>
      </div>
    );

  if (error)
    return (
      <p className="text-center text-red-500 font-semibold mt-10">{error}</p>
    );

  if (!withdrawal)
    return (
      <p className="text-center text-gray-400 mt-10">No withdrawal found</p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-800 bg-opacity-80 backdrop-blur-lg border border-yellow-500/30 rounded-2xl shadow-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-yellow-400 tracking-wide">
          🏦 Withdrawal Details
        </h2>

        <div className="space-y-4 text-gray-200">
          <p>
            <span className="text-yellow-300 font-semibold">User:</span>{" "}
            {withdrawal.withdraw.user.fullName} (
            {withdrawal.withdraw.user.email})
          </p>
          <p>
            <span className="text-yellow-300 font-semibold">Amount:</span>{" "}
            {formatter.format(withdrawal.withdraw.amount)}
          </p>
          {withdrawal.withdraw.method && (
            <p>
              <span className="text-yellow-300 font-semibold">Method:</span>{" "}
              {withdrawal.withdraw.method}
            </p>
          )}
          <p>
            <span className="text-yellow-300 font-semibold">Status:</span>{" "}
            <span
              className={`px-2 py-1 rounded text-white ${
                withdrawal.withdraw.status.toLowerCase() === "completed"
                  ? "bg-green-600"
                  : withdrawal.withdraw.status.toLowerCase() === "pending"
                  ? "bg-yellow-600"
                  : "bg-red-600"
              }`}
            >
              {withdrawal.withdraw.status}
            </span>
          </p>
          <p>
            <span className="text-yellow-300 font-semibold">Date:</span>{" "}
            {new Date(withdrawal.withdraw.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewWithdrawal;
