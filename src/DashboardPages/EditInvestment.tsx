import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppSelector } from "../hooks";

const productionUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:7000/api"
    : "https://brokers-backend-hbq6.onrender.com/api";

interface InvestmentData {
  _id: string;
  user: string;
  investmentType: "stocks" | "bonds" | "real-estate" | "crypto";
  investmentItem: string;
  amount: number;
  profit: number;
  note?: string;
  status: "pending" | "approved" | "rejected";
  durationType: "monthly" | "yearly";
  durationValue: number;
  createdAt: string;
}

const EditInvestment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.userState.user);

  const [formData, setFormData] = useState({
    investmentType: "stocks",
    investmentItem: "",
    amount: "",
    profit: "",
    note: "",
    status: "pending",
    durationType: "monthly",
    durationValue: "",
    createdAt: "",
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchInvestment = async () => {
      try {
        if (!id) {
          setError("Invalid investment ID");
          setLoading(false);
          return;
        }

        const res = await axios.get<{ investment: InvestmentData }>(
          `${productionUrl}/investment/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        const inv = res.data.investment;
        setFormData({
          investmentType: inv.investmentType,
          investmentItem: inv.investmentItem,
          amount: inv.amount.toString(),
          profit: inv.profit.toString(),
          note: inv.note || "",
          status: inv.status,
          durationType: inv.durationType,
          durationValue: inv.durationValue.toString(),
          createdAt: inv.createdAt ? inv.createdAt.slice(0, 16) : "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to fetch investment details");
      } finally {
        setLoading(false);
      }
    };

    fetchInvestment();
  }, [id, user?.token]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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
        `${productionUrl}/investment/${id}`,
        {
          investmentType: formData.investmentType,
          investmentItem: formData.investmentItem,
          amount: Number(formData.amount),
          profit: Number(formData.profit),
          note: formData.note,
          status: formData.status,
          durationType: formData.durationType,
          durationValue: Number(formData.durationValue),
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

      setSuccess("✅ Investment updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to update investment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-yellow-200 via-gray-100 to-blue-300">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 via-gray-900 to-blue-500 p-6 relative overflow-hidden">
      {/* Background Icons */}
      <div className="absolute top-10 left-10 opacity-10 text-yellow-200 text-8xl">🪙</div>
      <div className="absolute bottom-10 right-10 opacity-10 text-yellow-300 text-8xl">🏆</div>

      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-yellow-300/20">
        <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent">
          Edit Your Investment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Investment Type */}
          <div>
            <label className="block font-semibold mb-1 text-yellow-200">
              Investment Type
            </label>
            <select
              name="investmentType"
              value={formData.investmentType}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-yellow-300 bg-white/20 text-white focus:ring-2 focus:ring-yellow-400"
            >
             <option value="stocks" style={{ backgroundColor: "#FFD700", color: "#1a1a1a" }}>Stocks</option>
  <option value="bonds" style={{ backgroundColor: "#FFD700", color: "#1a1a1a" }}>Bonds</option>
  <option value="real-estate" style={{ backgroundColor: "#FFD700", color: "#1a1a1a" }}>Real Estate</option>
  <option value="crypto" style={{ backgroundColor: "#FFD700", color: "#1a1a1a" }}>Crypto</option>
            </select>
          </div>

          {/* Investment Item */}
          <div>
            <label className="block font-semibold mb-1 text-yellow-200">
              Investment Item
            </label>
            <input
              type="text"
              name="investmentItem"
              value={formData.investmentItem}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-yellow-300 bg-white/20 text-white placeholder-gray-200 focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block font-semibold mb-1 text-yellow-200">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-yellow-300 bg-white/20 text-white placeholder-gray-200 focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Profit */}
          <div>
            <label className="block font-semibold mb-1 text-yellow-200">
              Profit
            </label>
            <input
              type="number"
              name="profit"
              value={formData.profit}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-yellow-300 bg-white/20 text-white placeholder-gray-200 focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block font-semibold mb-1 text-yellow-200">
              Note
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-yellow-300 bg-white/20 text-white placeholder-gray-200 focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block font-semibold mb-1 text-yellow-200">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-yellow-300 bg-white/20 text-white focus:ring-2 focus:ring-yellow-400"
            >
              <option value="pending"  style={{ backgroundColor: "#FFD700", color: "#1a1a1a" }}>Pending</option>
              <option value="approved"  style={{ backgroundColor: "#FFD700", color: "#1a1a1a" }}>Approved</option>
              <option value="rejected"  style={{ backgroundColor: "#FFD700", color: "#1a1a1a" }}>Rejected</option>
            </select>
          </div>

          {/* Duration Type */}
          <div>
            <label className="block font-semibold mb-1 text-yellow-200">
              Duration Type
            </label>
            <select
              name="durationType"
              value={formData.durationType}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-yellow-300 bg-white/20 text-white focus:ring-2 focus:ring-yellow-400"
            >
              <option value="monthly"  style={{ backgroundColor: "#FFD700", color: "#1a1a1a" }}>Monthly</option>
              <option value="yearly"  style={{ backgroundColor: "#FFD700", color: "#1a1a1a" }}>Yearly</option>
            </select>
          </div>

          {/* Duration Value */}
          <div>
            <label className="block font-semibold mb-1 text-yellow-200">
              Duration Value
            </label>
            <input
              type="number"
              name="durationValue"
              value={formData.durationValue}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-yellow-300 bg-white/20 text-white placeholder-gray-200 focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Created At */}
          <div>
            <label className="block font-semibold mb-1 text-yellow-200">
              Created At
            </label>
            <input
              type="datetime-local"
              name="createdAt"
              value={formData.createdAt}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-yellow-300 bg-white/20 text-white focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-yellow-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2 shadow-lg"
            >
              {isSubmitting && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
              {isSubmitting ? "Updating..." : "Update Investment"}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-400/80 text-white px-6 py-2 rounded-lg hover:bg-gray-500/90 transition shadow-md"
            >
              Cancel
            </button>
          </div>

          {/* Messages */}
          {success && (
            <p className="text-green-300 font-semibold text-center">{success}</p>
          )}
          {error && (
            <p className="text-red-300 font-semibold text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditInvestment;
