import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppSelector } from "../hooks";

const productionUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:7000/api"
    : "https://brokers-backend-hbq6.onrender.com/api";

interface UserIn {
  fullName: string;
  email: string;
}

interface DepositIn {
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  user: UserIn;
}

interface Deposit {
  deposit: DepositIn;
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const EditDeposit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.userState.user);

  const [formData, setFormData] = useState({
    amount: "",
    status: "pending",
    createdAt: "",
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
            Authorization: `Bearer ${user?.token}`,
          },
        });

        setFormData({
          amount: res.data.deposit.amount.toString(),
          status: res.data.deposit.status,
          createdAt: res.data.deposit.createdAt
            ? res.data.deposit.createdAt.slice(0, 16)
            : "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to fetch deposit details");
      } finally {
        setLoading(false);
      }
    };

    fetchDeposit();
  }, [id, user?.token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      await axios.patch(
        `${productionUrl}/deposit/${id}`,
        {
          amount: Number(formData.amount),
          status: formData.status,
          createdAt: formData.createdAt
            ? new Date(formData.createdAt).toISOString()
            : undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      setSuccess("✅ Deposit updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to update deposit");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <span className="loading loading-ring loading-lg text-yellow-400"></span>
      </div>
    );

  if (error)
    return (
      <p className="text-red-400 bg-red-900 p-4 rounded-lg text-center">
        {error}
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 lg:px-80 bg-gradient-to-b from-gray-900 to-black border border-yellow-500/30">
      <h2 className="text-2xl font-bold mb-6 text-yellow-400 text-center">
        ✨ Edit Deposit ✨
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5 p-8 shadow-2xl rounded-lg border border-slate-800">
        {/* Amount */}
        <div>
          <label className="block font-medium mb-1 text-yellow-300">
            Amount
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border border-yellow-500 bg-gray-800 text-yellow-200 focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block font-medium mb-1 text-yellow-300">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border border-yellow-500 bg-gray-800 text-yellow-200 focus:ring-2 focus:ring-yellow-400"
          >
            <option value="pending" className="bg-gray-900">
              Pending
            </option>
            <option value="approved" className="bg-gray-900">
              Approved
            </option>
            <option value="rejected" className="bg-gray-900">
              Rejected
            </option>
          </select>
        </div>

        {/* Created At */}
        <div>
          <label className="block font-medium mb-1 text-yellow-300">
            Created At
          </label>
          <input
            type="datetime-local"
            name="createdAt"
            value={formData.createdAt}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-yellow-500 bg-gray-800 text-yellow-200 focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-yellow-500 text-black px-4 py-3 rounded-lg hover:bg-yellow-400 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting && (
              <svg
                className="animate-spin h-5 w-5 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            {isSubmitting ? "Updating..." : "Update Deposit"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-500 transition-all font-semibold"
          >
            Cancel
          </button>
        </div>

        {/* Messages */}
        {success && (
          <p className="text-green-400 font-semibold text-center">{success}</p>
        )}
        {error && (
          <p className="text-red-400 font-semibold text-center">{error}</p>
        )}
      </form>
    </div>
  );
};

export default EditDeposit;
