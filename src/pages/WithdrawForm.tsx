// src/pages/WithdrawForm.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppSelector } from "../hooks";
import { useNavigate, Link } from "react-router-dom";
import { formatter } from "../utils/utils";

const productionUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:7000/api"
    : "https://brokers-backend-hbq6.onrender.com/api";

const WithdrawForm: React.FC = () => {
  const [amount, setAmount] = useState<string>("");
  const [method, setMethod] = useState<"bank" | "crypto">("bank");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [cryptoType, setCryptoType] = useState<"BTC" | "ETH" | "USDT">("BTC");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [accountBalance, setAccountBalance] = useState<number>(0);
  const [kycVerified, setKycVerified] = useState<string | null>(null);

  const { user } = useAppSelector((state) => state.userState);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (!user?.token) return;
        const res = await axios.get<{ user: { accountBalance: number; kycVerified: string } }>(
          `${productionUrl}/auth/me`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setAccountBalance(res.data.user.accountBalance ?? 0);
        setKycVerified(res.data.user.kycVerified ?? "false");
      } catch (err) {
        console.error("Failed to fetch user info", err);
      }
    };
    fetchUserInfo();
  }, [user?.token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    if (kycVerified === "false") {
      setError("Your account is suspended. Please contact support.");
      setLoading(false);
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid withdrawal amount.");
      setLoading(false);
      return;
    }
    if (numericAmount > accountBalance) {
      setError("Amount exceeds available account balance.");
      setLoading(false);
      return;
    }

    try {
      const accountDetails =
        method === "bank"
          ? { accountNumber, bankName }
          : { cryptoType, walletAddress };

      await axios.post(
        `${productionUrl}/withdraws`,
        { amount: numericAmount, method, accountDetails },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      setSuccess("Withdrawal request submitted successfully!");
      setAmount("");
      setMethod("bank");
      setAccountNumber("");
      setBankName("");
      setWalletAddress("");
      setCryptoType("BTC");
    } catch (err) {
      console.error("Withdrawal error:", err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (kycVerified === null) {
    return (
      <div className="flex justify-center items-center min-h-screen text-yellow-400">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-black to-yellow-900 text-white rounded-lg shadow-lg">

      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-yellow-400 mb-6">Withdraw Funds</h1>

      {kycVerified === "false" && (
        <div className="mb-4 p-4 border border-red-600 bg-red-100 text-red-700 rounded">
          Your account is suspended. Please contact support.
        </div>
      )}

      {success && <p className="mb-4 text-green-400 font-semibold">{success}</p>}
      {error && (
        <div className="mb-4 text-red-400 font-semibold">
          {error}
          {error.includes("exceeds") && (
            <div className="mt-2">
              <Link to="/depositFunds" className="text-yellow-400 underline hover:text-yellow-300">
                Deposit More Funds
              </Link>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 ">
        {/* Method */}
        <div>
          <label className="block mb-1">Withdrawal Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as "bank" | "crypto")}
            className="w-full p-2 rounded bg-gray-800 border border-gray-600"
            disabled={kycVerified === "false"}
          >
            <option value="bank">🏦 Bank Transfer</option>
            <option value="crypto">💱 Cryptocurrency</option>
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block mb-1">
            Amount (USD) — Available: {formatter.format(accountBalance)}
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-600"
            required
            disabled={kycVerified === "false"}
            min="0"
            step="0.01"
          />
        </div>

        {/* Bank Fields */}
        {method === "bank" && (
          <>
            <div>
              <label className="block mb-1">Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                required
                disabled={kycVerified === "false"}
              />
            </div>
            <div>
              <label className="block mb-1">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                required
                disabled={kycVerified === "false"}
              />
            </div>
          </>
        )}

        {/* Crypto Fields */}
        {method === "crypto" && (
          <>
            <div>
              <label className="block mb-1">Cryptocurrency</label>
              <select
                value={cryptoType}
                onChange={(e) => setCryptoType(e.target.value as "BTC" | "ETH" | "USDT")}
                className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                disabled={kycVerified === "false"}
              >
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ETH)</option>
                <option value="USDT">Tether (USDT)</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Wallet Address</label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                required
                disabled={kycVerified === "false"}
              />
            </div>
          </>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded font-semibold flex items-center gap-2 disabled:opacity-50"
          disabled={loading || kycVerified === "false"}
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-black"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 11-8 8z" />
            </svg>
          )}
          {loading ? "Submitting..." : "Submit Withdrawal"}
        </button>
      </form>
      </div>
      
    </div>
  );
};

export default WithdrawForm;
