// src/pages/CryptoPage.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAppSelector } from "../hooks";
import { useNavigate } from "react-router-dom";

const productionUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:7000/api"
    : "https://brokers-backend-h2nt.onrender.com/api";

const CryptoPage: React.FC = () => {
  const [receipt, setReceipt] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const user = useAppSelector((state) => state.userState.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceipt(e.target.files[0]);
      setSuccessMessage("");
      setErrorMessage("");
    }
  };

  const handleUpload = async () => {
    if (!receipt || !user?.token) {
      setErrorMessage("No receipt selected or user not authenticated.");
      return;
    }

    const formData = new FormData();
    formData.append("image", receipt);

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await axios.post(
        `${productionUrl}/upload-receipt/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      console.log("Receipt uploaded:", response.data);
      setSuccessMessage(
        "Receipt uploaded successfully. Awaiting admin approval."
      );
      setReceipt(null);
    } catch (error: any) {
      console.error("Upload failed:", error.response?.data || error.message);
      setErrorMessage("Failed to upload receipt. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cryptoOptions = [
    {
      name: "Bitcoin",
      symbol: "BTC",
      network: "Bitcoin",
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      network: "ERC-20",
      address: "0xAbC1234567890dEF1234567890abcdef12345678",
    },
    {
      name: "Tether",
      symbol: "USDT",
      network: "TRC-20",
      address: "TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-gray-900 via-black to-yellow-900 min-h-screen text-white">
       <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-yellow-400 mb-6">
        Cryptocurrency Deposit
      </h1>
      <p className="text-gray-300 mb-4">
        Select your preferred cryptocurrency to fund your account. Ensure you
        send to the correct address and network.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {cryptoOptions.map((crypto, index) => (
          <div
            key={index}
            className="bg-gray-800 border border-yellow-500 p-6 rounded shadow hover:shadow-yellow-500/40 transition"
          >
            <h3 className="text-lg font-semibold text-yellow-300">
              {crypto.name} ({crypto.symbol})
            </h3>
            <p className="text-sm text-gray-400">Network: {crypto.network}</p>
            <div className="mt-2 text-sm text-gray-300">
              <strong>Wallet Address:</strong>
              <div className="bg-gray-900 mt-1 p-2 rounded break-all border border-yellow-600">
                {crypto.address}
              </div>
            </div>
            <div className="mt-2 text-xs text-yellow-200 bg-yellow-900/30 p-2 rounded">
              ⚠️ Always double-check network & address — transactions are
              irreversible.
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-200">
        <strong>Note:</strong> Keep your transaction receipt ready and upload it
        after sending funds for verification.
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-yellow-300 mb-2">
          Upload Payment Receipt
        </label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-yellow-400/20 file:text-yellow-300 hover:file:bg-yellow-500/30"
        />
        {receipt && (
          <div className="mt-2 text-sm text-green-400">
            Selected: {receipt.name}
          </div>
        )}

        {successMessage && (
          <div className="mt-4 text-sm text-green-400">{successMessage}</div>
        )}

        {errorMessage && (
          <div className="mt-4 text-sm text-red-400">{errorMessage}</div>
        )}

        <button
          onClick={handleUpload}
          disabled={loading || !receipt}
          className="mt-4 bg-yellow-500 text-black py-2 px-4 rounded hover:bg-yellow-400 transition disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload Receipt"}
        </button>
      </div>
       </div>
      
    </div>
  );
};

export default CryptoPage;
