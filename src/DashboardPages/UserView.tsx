import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useAppSelector } from "../hooks";

type User = {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  phone: string;
  accountBalance: number;
  kycVerified: boolean;
};

const UserView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const token = useAppSelector((state) => state.userState.user?.token);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const baseURL =
    import.meta.env.MODE === "production"
      ? "https://brokers-backend-h2nt.onrender.com/api"
      : "http://localhost:7000/api";

  useEffect(() => {
    const fetchUser = async (): Promise<void> => {
      try {
        const response = await axios.get<{ user: User }>(
          `${baseURL}/auth/single/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data.user);
      } catch (error) {
        const err = error as AxiosError;
        console.error("Error fetching user:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id && token) {
      fetchUser();
    }
  }, [id, token, baseURL]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-ring loading-lg text-yellow-400">
          Loading...
        </span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-red-500 font-semibold">
        User not found or something went wrong.
      </div>
    );
  }

  return (
    <div className="max-w-7xl bg-[#0d1117]  mx-auto p-6">
      {/* Title */}
      <h2 className="max-w-4xl mx-auto text-3xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
        User Details
      </h2>

      {/* Card */}
      <div className="max-w-4xl mx-auto border border-yellow-500/30 p-6 space-y-4 text-white">
        <div>
          <strong className="text-yellow-400">Name:</strong> {user.fullName}
        </div>
        <div>
          <strong className="text-yellow-400">Account Balance:</strong>{" "}
          ${user.accountBalance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
        <div>
          <strong className="text-yellow-400">Email:</strong> {user.email}
        </div>
        <div>
          <strong className="text-yellow-400">Role:</strong> {user.role}
        </div>
        <div>
          <strong className="text-yellow-400">Phone:</strong> {user.phone || "N/A"}
        </div>
        <div>
          <strong className="text-yellow-400">Status:</strong>{" "}
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              user.kycVerified
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {user.kycVerified ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserView;
