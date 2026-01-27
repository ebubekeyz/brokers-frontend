import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppSelector } from "../hooks";

const productionUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:7000/api"
    : "https://brokers-backend-h2nt.onrender.com/api";

interface WithdrawData {
  _id: string;
  user: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  method: "bank" | "crypto";
  accountDetails: {
    accountNumber?: string;
    bankName?: string;
    cryptoType?: string;
    walletAddress?: string;
  };
  requestedAt: string;
  processedAt?: string;
}

const EditWithdrawal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.userState.user);

  const [formData, setFormData] = useState({
    amount: "",
    status: "pending",
    method: "bank",
    accountNumber: "",
    bankName: "",
    cryptoType: "",
    walletAddress: "",
    createdAt: "",
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchWithdrawal = async () => {
      try {
        if (!id) {
          setError("Invalid withdrawal ID");
          setLoading(false);
          return;
        }

        const res = await axios.get<{ withdraw: WithdrawData & { createdAt?: string } }>(
          `${productionUrl}/withdraws/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        const wd = res.data.withdraw;
        setFormData({
          amount: wd.amount.toString(),
          status: wd.status,
          method: wd.method,
          accountNumber: wd.accountDetails?.accountNumber || "",
          bankName: wd.accountDetails?.bankName || "",
          cryptoType: wd.accountDetails?.cryptoType || "",
          walletAddress: wd.accountDetails?.walletAddress || "",
          createdAt: wd?.createdAt ? wd.createdAt.slice(0, 16) : "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to fetch withdrawal details");
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawal();
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
      const accountDetails = {
        accountNumber: formData.accountNumber,
        bankName: formData.bankName,
        cryptoType: formData.cryptoType,
        walletAddress: formData.walletAddress,
      };

      await axios.put(
        `${productionUrl}/withdraws/${id}`,
        {
          amount: Number(formData.amount),
          status: formData.status,
          method: formData.method,
          accountNumber: formData.accountNumber,
          bankName: formData.bankName,
          cryptoType: formData.cryptoType,
          walletAddress: formData.walletAddress,
          accountDetails,
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

      setSuccess("✅ Withdrawal updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to update withdrawal");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 lg:px-80 bg-gradient-to-b from-[#0d1b2a] to-[#1b263b] text-white">
      <h2 className="text-2xl font-bold mb-6 text-yellow-400 text-center">
        Edit Withdrawal
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5  p-8 rounded-lg shadow-2xl">
        {/* Amount */}
        <div>
          <label className="block font-semibold mb-1 text-yellow-300">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-[#1b263b] border border-yellow-500 text-white focus:ring-2 focus:ring-yellow-400 outline-none"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block font-semibold mb-1 text-yellow-300">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-[#1b263b] border border-yellow-500 text-white focus:ring-2 focus:ring-yellow-400 outline-none"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Method */}
        <div>
          <label className="block font-semibold mb-1 text-yellow-300">Method</label>
          <select
            name="method"
            value={formData.method}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-[#1b263b] border border-yellow-500 text-white focus:ring-2 focus:ring-yellow-400 outline-none"
          >
            <option value="bank">Bank</option>
            <option value="crypto">Crypto</option>
          </select>
        </div>

        {/* Conditional Fields */}
        {formData.method === "bank" && (
          <>
            <div>
              <label className="block font-semibold mb-1 text-yellow-300">Account Number</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#1b263b] border border-yellow-500 text-white focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-yellow-300">Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#1b263b] border border-yellow-500 text-white focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </div>
          </>
        )}

        {formData.method === "crypto" && (
          <>
            <div>
              <label className="block font-semibold mb-1 text-yellow-300">Crypto Type</label>
              <input
                type="text"
                name="cryptoType"
                value={formData.cryptoType}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#1b263b] border border-yellow-500 text-white focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-yellow-300">Wallet Address</label>
              <input
                type="text"
                name="walletAddress"
                value={formData.walletAddress}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#1b263b] border border-yellow-500 text-white focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </div>
          </>
        )}

        {/* Created At */}
        <div>
          <label className="block font-semibold mb-1 text-yellow-300">Created At</label>
          <input
            type="datetime-local"
            name="createdAt"
            value={formData.createdAt}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#1b263b] border border-yellow-500 text-white focus:ring-2 focus:ring-yellow-400 outline-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-[#0d1b2a] px-4 py-2 rounded-lg font-bold transition disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : "Update"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            Cancel
          </button>
        </div>

        {/* Messages */}
        {success && <p className="text-green-400 font-semibold">{success}</p>}
        {error && <p className="text-red-400 font-semibold">{error}</p>}
      </form>
    </div>
  );
};

export default EditWithdrawal;
