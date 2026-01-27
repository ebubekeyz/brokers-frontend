import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppSelector } from "../hooks"; // adjust the import path if needed

const Settings: React.FC = () => {
  const token = useAppSelector((state) => state.userState.user?.token);

  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [companyAddress, setCompanyAddress] = useState<string>("");
  const [currency, setCurrency] = useState<string>("USD");
  const [loading, setLoading] = useState<boolean>(false);
  const [settingsLoading, setSettingsLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);

  const productionUrl =
    process.env.NODE_ENV !== "production"
      ? "http://localhost:7000/api"
      : "https://brokers-backend-h2nt.onrender.com/api";

  useEffect(() => {
    const fetchSettings = async () => {
      if (!token) return;
      setSettingsLoading(true);
      try {
        const res = await axios.get(`${productionUrl}/settings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = res.data.settings;

        setEmail(data.email || "");
        setPhone(data.phone || "");
        setCompanyName(data.companyName || "");
        setCompanyAddress(data.companyAddress || "");
        setCurrency(data.currency || "USD");
      } catch (error) {
        console.error("Failed to fetch settings", error);
      } finally {
        setSettingsLoading(false);
      }
    };

    fetchSettings();
  }, [token]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setSuccess(false);

    try {
      await axios.patch(
        `${productionUrl}/settings/update`,
        {
          email,
          phone,
          companyName,
          companyAddress,
          currency,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess(true);
    } catch (error) {
      console.error("Failed to save settings", error);
    } finally {
      setLoading(false);
    }
  };

  if (settingsLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-yellow-800 to-yellow-600">
        <span className="loading loading-ring loading-lg text-yellow-300"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900  p-6 w-full">
      <h2 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">
        Admin Settings
      </h2>

      <form
        onSubmit={handleSave}
        className="rounded-2xl max-w-4xl mx-auto p-8 shadow-2xl border border-yellow-500/30 space-y-6"
      >
        {/* Company Name */}
        <div>
          <label className="block text-sm font-semibold text-yellow-300 mb-1">
            Company Name
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full bg-gray-800 text-white border border-yellow-500/20 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Company Address */}
        <div>
          <label className="block text-sm font-semibold text-yellow-300 mb-1">
            Company Address
          </label>
          <input
            type="text"
            value={companyAddress}
            onChange={(e) => setCompanyAddress(e.target.value)}
            className="w-full bg-gray-800 text-white border border-yellow-500/20 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Admin Email */}
        <div>
          <label className="block text-sm font-semibold text-yellow-300 mb-1">
            Admin Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-800 text-white border border-yellow-500/20 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-semibold text-yellow-300 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-gray-800 text-white border border-yellow-500/20 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Default Currency */}
        <div>
          <label className="block text-sm font-semibold text-yellow-300 mb-1">
            Default Currency
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full bg-gray-800 text-white border border-yellow-500/20 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="NGN">NGN - Nigerian Naira</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-md text-black font-bold transition ${
              loading
                ? "bg-yellow-400/60 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-300"
            }`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="text-green-400 text-sm text-right font-medium">
            ✅ Settings updated successfully!
          </div>
        )}
      </form>
    </div>
  );
};

export default Settings;
