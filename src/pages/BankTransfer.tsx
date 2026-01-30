// src/pages/BankTransferPage.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useAppSelector } from "../hooks";
import { useNavigate } from "react-router-dom";

const productionUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:7000/api"
    : "https://brokers-backend-h2nt.onrender.com/api";

const BankTransferPage: React.FC = () => {
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
       setLoading(false);

      setReceipt(null);
    } catch (error: any) {
      console.error("Upload failed:", error.response?.data || error.message);
      setErrorMessage("Failed to upload receipt. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const bankDetails = {
    bankName: "Wells Fargo",
    accountName: "Morgan Albair",
    accountNumber: "6371888089",
    swiftCode: "WFBIUS6S",
    routingNumber: "121042882",
    bankAddress: "915 Northern Blud Clarks Summit, PA 18411",
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-gray-900 via-black to-yellow-900 min-h-screen text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-yellow-400 mb-6">
        Bank Transfer Deposit
      </h1>
      <p className="text-gray-300 mb-4">
        Please use the bank details below to make your deposit. Ensure you
        include your User ID or transaction reference in the payment description.
      </p>

      <div className="bg-gray-800 border border-yellow-500 p-6 rounded shadow-lg mb-6">
        <h2 className="text-lg font-semibold text-yellow-300 mb-4">
          Bank Account Details
        </h2>
        <ul className="space-y-2 text-gray-300">
          <li>
            <strong>Bank Name:</strong> {bankDetails.bankName}
          </li>
          <li>
            <strong>Account Name:</strong> {bankDetails.accountName}
          </li>
          <li>
            <strong>Account Number:</strong> {bankDetails.accountNumber}
          </li>
          <li>
            <strong>SWIFT Code:</strong> {bankDetails.swiftCode}
            </li>
            <li>
            <strong>Routing Number:</strong> {bankDetails.routingNumber}
          </li>
          <li>
            <strong>Bank Address:</strong> {bankDetails.bankAddress}
          </li>
        </ul>

        <div className="mt-4 text-xs text-yellow-200 bg-yellow-900/30 p-2 rounded">
          ⚠️ Keep your transaction receipt ready for upload after sending funds.
        </div>
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

export default BankTransferPage;
