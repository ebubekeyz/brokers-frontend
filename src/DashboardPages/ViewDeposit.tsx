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

interface DepositIn {
  _id: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  user: UserIn;
}

interface Deposit {
  deposit: DepositIn;
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const ViewDeposit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const user = useAppSelector((state) => state.userState.user);
  const [deposit, setDeposit] = useState<Deposit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDeposit = async () => {
      try {
        if (!id) {
          setError("Invalid deposit ID");
          setLoading(false);
          return;
        }

        const res = await axios.get<Deposit>(`${productionUrl}/deposit/${id}`, {
          headers: {
            Authorization: `Bearer ${user?.token || ""}`,
          },
        });

        setDeposit(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load deposit details");
      } finally {
        setLoading(false);
      }
    };

    fetchDeposit();
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

  if (!deposit)
    return (
      <p className="text-center text-gray-400 mt-6">No deposit record found.</p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-800 bg-opacity-80 backdrop-blur-lg border border-yellow-500/30 rounded-2xl shadow-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-yellow-400 tracking-wide">
          💰 Deposit Details
        </h2>

        <div className="space-y-4 text-gray-200">
          <p>
            <span className="text-yellow-300 font-semibold">User:</span>{" "}
            {deposit.deposit.user.fullName} ({deposit.deposit.user.email})
          </p>
          <p>
            <span className="text-yellow-300 font-semibold">Amount:</span>{" "}
            {formatter.format(deposit.deposit.amount)}
          </p>
          <p>
            <span className="text-yellow-300 font-semibold">Status:</span>{" "}
            <span
              className={`px-2 py-1 rounded ${
                deposit.deposit.status === "approved"
                  ? "bg-green-600 text-white"
                  : deposit.deposit.status === "pending"
                  ? "bg-yellow-600 text-white"
                  : "bg-red-600 text-white"
              }`}
            >
              {deposit.deposit.status}
            </span>
          </p>
          <p>
            <span className="text-yellow-300 font-semibold">Date:</span>{" "}
            {new Date(deposit.deposit.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewDeposit;
