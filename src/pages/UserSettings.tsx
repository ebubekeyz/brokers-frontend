import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useAppSelector } from "../hooks";

const productionUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:7000/api"
    : "https://brokers-backend-hbq6.onrender.com/api";

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  walletAddress: string;
}

interface UserData {
  user: User;
  token: string;
}

const UserSettings: React.FC = () => {
  const user = useAppSelector((state) => state.userState.user) as UserData | null;
  const [activeTab, setActiveTab] = useState<"profile" | "reset">("profile");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.user.fullName);
      setEmail(user.user.email);
      setPhoneNumber(user.user.phone || "");
      setWalletAddress(user.user.walletAddress || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      if (!user) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      if (activeTab === "profile") {
        await axios.put(
          `${productionUrl}/auth/${user.user.id}`,
          { fullName, email, walletAddress,  phone: phoneNumber },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setMessage("Profile updated successfully!");
      } else {
        if (newPassword !== confirmPassword) {
          setError("New passwords do not match.");
          setLoading(false);
          return;
        }
        await axios.patch(
          `${productionUrl}/auth/reset-password`,
          { oldPassword: currentPassword, newPassword },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setMessage("Password changed successfully!");
      }

      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      const axiosError = err as AxiosError<{ msg: string }>;
      setError(axiosError?.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-6 flex justify-center">
      <div className="w-full max-w-2xl bg-gray-900/80 border border-yellow-500/30 p-6 rounded-2xl shadow-lg backdrop-blur-md">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-300 bg-clip-text text-transparent text-center mb-8">
          Barick Gold – User Settings
        </h2>

        {/* Tabs */}
        <div className="flex justify-center flex-wrap gap-3 mb-8">
          {["profile", "reset"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "profile" | "reset")}
              className={`px-5 py-2 rounded-full font-semibold border transition-all duration-300 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-400 text-black shadow-lg"
                  : "bg-gray-800 text-gray-300 border-yellow-500/30 hover:border-yellow-400"
              }`}
            >
              {tab === "profile" ? "Profile Settings" : "Reset Password"}
            </button>
          ))}
        </div>

        {/* Feedback */}
        {message && (
          <div className="mb-4 text-green-400 font-medium bg-green-900/30 border border-green-500 p-3 rounded text-center">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 text-red-400 font-medium bg-red-900/30 border border-red-500 p-3 rounded text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {activeTab === "profile" ? (
            <>
              <div>
                <label className="block mb-1 font-medium text-yellow-400">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-yellow-500/30 bg-black text-white px-4 py-2 rounded focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-yellow-400">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-yellow-500/30 bg-black text-white px-4 py-2 rounded focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-yellow-400">Phone Number</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full border border-yellow-500/30 bg-black text-white px-4 py-2 rounded focus:ring-2 focus:ring-yellow-400"
                />
              </div>

               <div>
                <label className="block mb-1 font-medium text-yellow-400">Wallet Address</label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="w-full border border-yellow-500/30 bg-black text-white px-4 py-2 rounded focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block mb-1 font-medium text-yellow-400">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-yellow-500/30 bg-black text-white px-4 py-2 rounded focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-yellow-400">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-yellow-500/30 bg-black text-white px-4 py-2 rounded focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-yellow-400">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-yellow-500/30 bg-black text-white px-4 py-2 rounded focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black py-2 rounded font-semibold hover:from-yellow-400 hover:to-yellow-300 transition-all shadow-lg"
          >
            {loading && (
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
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                ></path>
              </svg>
            )}
            {loading
              ? "Processing..."
              : activeTab === "profile"
              ? "Update Profile"
              : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserSettings;
