import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useAppSelector } from "../hooks";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatter } from "../utils/utils";

type User = {
  name: string;
  email: string;
  role: "user" | "broker" | "admin";
  phone: string;
  kycVerified: string;
  accountBalance: number;
};

type ApiUser = {
  fullName: string;
  email: string;
  role: "user" | "broker" | "admin";
  phone: string;
  kycVerified: string;
  accountBalance: number;
};

interface InvestmentItem {
  label: string;
  price: number;
  percentage: number;
}

const investmentOptions: Record<string, InvestmentItem[]> = {
gold: [
      { label: "Gold Bullion (50oz)", price: 120000, percentage: 50 },
      { label: "Gold ETF", price: 72000, percentage: 30 },
      { label: "Gold Mining Stocks", price: 48000, percentage: 20 },
    ],
    crypto: [
      { label: "Bitcoin (BTC)", price: 65000, percentage: 10 },
      { label: "Ethereum (ETH)", price: 3800, percentage: 9 },
      { label: "Solana (SOL)", price: 160, percentage: 7 },
    ],
    hybrid: [
      { label: "50% Gold + 50% BTC", price: 10000, percentage: 8 },
      { label: "Gold & Crypto Balanced Fund", price: 5000, percentage: 7 },
    ],
};

const UserEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.userState.user?.token);

  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    role: "user",
    phone: "",
    kycVerified: "false",
    accountBalance: 0,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [depositStatus, setDepositStatus] = useState<
    "approved" | "pending" | "rejected"
  >("approved");
  const [depositLoading, setDepositLoading] = useState<boolean>(false);

  // Investment form state
  const [investmentType, setInvestmentType] = useState<string>("");
  const [investmentItem, setInvestmentItem] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [durationType, setDurationType] = useState<string>("");
  const [durationValue, setDurationValue] = useState<string>("");
  const [investmentLoading, setInvestmentLoading] = useState<boolean>(false);
  const [investmentError, setInvestmentError] = useState<string>("");

   const [success, setSuccess] = useState<string>("");
const [method, setMethod] = useState<"bank" | "crypto">("bank");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [cryptoType, setCryptoType] = useState<"BTC" | "ETH" | "USDT">("BTC");
    const [error, setError] = useState<string>("");


  const handleWithdrawSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      setSuccess("");
      setError("");
  
      if (user.kycVerified === "false") {
        setError("Your account is suspended. Please contact the support team.");
        setLoading(false);
        return;
      }
  
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        setError("Please enter a valid withdrawal amount.");
        setLoading(false);
        return;
      }
  
      if (numericAmount > user.accountBalance) {
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
          `${productionUrl}/withdraws/admin/withdraw/${id}`,
          {
            amount: numericAmount,
            method,
            accountDetails,
            status: 'approved'
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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
  
    if (user.kycVerified === null) {
      return  <span className="loading loading-spinner loading-sm"></span>;
    }


  const productionUrl =
    import.meta.env.MODE !== "production"
      ? "http://localhost:7000/api"
      : "https://brokers-backend-hbq6.onrender.com/api";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get<{ user: ApiUser }>(
          `${productionUrl}/auth/single/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const fetchedUser = response.data.user;
        setUser({
          name: fetchedUser.fullName,
          email: fetchedUser.email,
          role: fetchedUser.role,
          phone: fetchedUser.phone,
          kycVerified: fetchedUser.kycVerified,
          accountBalance: fetchedUser.accountBalance || 0,
        });
      } catch (error) {
        const err = error as AxiosError;
        console.error("Error fetching user:", err.message);
      } finally {
        setInitialLoading(false);
      }
    };

    if (id && token) {
      fetchUser();
    }
  }, [id, token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: name === "accountBalance" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(
        `${productionUrl}/auth/${id}`,
        {
          fullName: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          kycVerified: user.kycVerified,
          accountBalance: user.accountBalance,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("User updated successfully!");
      navigate("/adminDashboard/userPage");
    } catch (error) {
      const err = error as AxiosError;
      console.error("Error updating user:", err.message);
      alert("Error updating user");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDepositLoading(true);

    try {
      await axios.post(
        `${productionUrl}/deposit/admin/${id}`,
        {
          amount: depositAmount,
          status: depositStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Deposit successful!");
    } catch (error) {
      const err = error as AxiosError;
      console.error("Deposit error:", err.message);
      alert("Error processing deposit");
    } finally {
      setDepositLoading(false);
    }
  };

  // Investment minimum amount helper
  const getMinimumAmount = (): number => {
    if (!investmentType || !investmentItem) return 0;
    const item = investmentOptions[investmentType]?.find(
      (i) => i.label === investmentItem
    );
    return item ? item.price : 0;
  };

  const handleInvestmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInvestmentError("");

    if (user.kycVerified === "false") {
      setInvestmentError("User account is inactive. Cannot invest.");
      return;
    }

    const minAmount = getMinimumAmount();
    const enteredAmount = parseFloat(amount);

    if (isNaN(enteredAmount)) {
      setInvestmentError("Please enter a valid amount.");
      return;
    }

    if (enteredAmount < minAmount) {
      setInvestmentError(
        `Minimum investment for ${investmentItem} is $${minAmount.toLocaleString()}`
      );
      return;
    }

    if (enteredAmount > user.accountBalance) {
      setInvestmentError(
        `Amount exceeds user's account balance of $${user.accountBalance.toLocaleString()}`
      );
      return;
    }

    if (
      !durationType ||
      !durationValue ||
      isNaN(parseInt(durationValue)) ||
      parseInt(durationValue) < 1
    ) {
      setInvestmentError("Please select a valid duration.");
      return;
    }

    setInvestmentLoading(true);

    try {
      await axios.post(
        `${productionUrl}/investment/admin/${id}`,
        {
          investmentType,
          investmentItem,
          amount: enteredAmount,
          note,
          durationType,
          durationValue: parseInt(durationValue),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Investment submitted successfully!");
      setInvestmentType("");
      setInvestmentItem("");
      setAmount("");
      setNote("");
      setDurationType("");
      setDurationValue("");
    } catch (error) {
      const err = error as AxiosError;
      setInvestmentError(
        err.response?.data?.msg || err.message || "Failed to submit investment"
      );
    } finally {
      setInvestmentLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  return (
    
    <div className="max-w-7xl mx-auto p-6 lg:px-82 bg-gradient-to-br from-yellow-300 via-gray-900 to-blue-500">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6 text-white">Edit User</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 space-y-4"
      >
        {/* User edit fields */}
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Role</label>
          <select
            name="role"
            value={user.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="user">User</option>
            <option value="broker">Broker</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select
            name="kycVerified"
            value={user.kycVerified}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Account Balance ($)</label>
          <input
            type="number"
            name="accountBalance"
            value={user.accountBalance}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            step="0.01"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading && <span className="loading loading-spinner loading-sm"></span>}
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {/* Admin Deposit Form */}
      <h3 className="text-xl font-semibold mt-10 mb-4 text-white">Admin Deposit to User</h3>
      <form
        onSubmit={handleAdminDeposit}
        className="bg-white shadow rounded-lg p-6 space-y-4"
      >
        <div>
          <label className="block mb-1 font-medium">Deposit Amount ($)</label>
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(parseFloat(e.target.value))}
            className="w-full border border-gray-300 rounded px-3 py-2"
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select
            value={depositStatus}
            onChange={(e) =>
              setDepositStatus(e.target.value as "approved" | "pending" | "rejected")
            }
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 flex items-center justify-center gap-2"
          disabled={depositLoading}
        >
          {depositLoading && <span className="loading loading-spinner loading-sm"></span>}
          {depositLoading ? "Depositing..." : "Deposit"}
        </button>
      </form>

      {/* Investment Form */}
      <h3 className="text-xl text-white font-semibold mt-10 mb-4">Create Investment for User</h3>
      <form
        onSubmit={handleInvestmentSubmit}
        className="bg-white shadow rounded-lg p-6 space-y-4"
      >
        {/* Investment Type */}
        <div>
          <label className="block mb-1 font-medium">Investment Type</label>
          <select
            value={investmentType}
            onChange={(e) => {
              setInvestmentType(e.target.value);
              setInvestmentItem("");
              setInvestmentError("");
            }}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
            disabled={user.kycVerified === "false"}
          >
            <option value="">-- Select --</option>
            <option value="gold">Gold Investments</option>
            <option value="crypto">Cryptocurrency</option>
            <option value="hybrid">Hybrid Gold + Crypto</option>
          </select>
        </div>

        {/* Investment Item */}
        {investmentType && (
          <div>
            <label className="block mb-1 font-medium">Investment Item</label>
            <select
              value={investmentItem}
              onChange={(e) => {
                setInvestmentItem(e.target.value);
                setInvestmentError("");
              }}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
              disabled={user.kycVerified === "false"}
            >
              <option value="">-- Select --</option>
              {investmentOptions[investmentType]?.map((item) => (
                <option key={item.label} value={item.label}>
                  {item.label} - ${item.price.toLocaleString()} - {item.percentage}% ROI
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Amount */}
        <div>
          <label className="block mb-1 font-medium">Amount (USD)</label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter amount"
            required
            disabled={user.kycVerified === "false"}
          />
        </div>

        {/* Duration Type */}
        <div>
          <label className="block mb-1 font-medium">Duration Type</label>
          <select
            value={durationType}
            onChange={(e) => {
              setDurationType(e.target.value);
              setDurationValue("");
            }}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
            disabled={user.kycVerified === "false"}
          >
            <option value="">-- Select --</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* Duration Value */}
        {durationType && (
          <div>
            <label className="block mb-1 font-medium">
              {durationType === "monthly" ? "Number of Months" : "Number of Years"}
            </label>
            <input
              type="number"
              min={1}
              value={durationValue}
              onChange={(e) => setDurationValue(e.target.value)}
              placeholder={`Enter ${durationType === "monthly" ? "months" : "years"}`}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
              disabled={user.kycVerified === "false"}
            />
          </div>
        )}

        {/* Note */}
        <div>
          <label className="block mb-1 font-medium">Note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Add a note (optional)"
            disabled={user.kycVerified === "false"}
          />
        </div>

        {/* Error Message */}
        {investmentError && <p className="text-red-600 text-sm">{investmentError}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 flex items-center justify-center gap-2"
          disabled={investmentLoading || user.kycVerified === "false"}
        >
          {investmentLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Submit Investment"
          )}
        </button>
      </form>



       <h3 className="text-xl font-semibold mt-10 mb-4 text-white">Create Withdrawals for User</h3>

      {success && <p className="mb-4 text-green-600 font-semibold">{success}</p>}
      
       <form onSubmit={handleWithdrawSubmit} className="bg-white shadow rounded-lg p-6 space-y-4 lg:max-w-3xl lg:mx-auto">
              <div>
                <label className="block text-gray-700 mb-1">Withdrawal Method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as "bank" | "crypto")}
                  className="w-full border p-2 rounded"
                  disabled={user.kycVerified === "false"}
                >
                  <option value="bank">Bank Transfer</option>
                  <option value="crypto">Cryptocurrency</option>
                </select>
              </div>
      
              <div>
                <label className="block text-gray-700 mb-1">
                  Amount (USD) (Available: {formatter.format(user.accountBalance)})
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border p-2 rounded"
                  required
                  disabled={user.kycVerified === "false"}
                  min="0"
                  step="0.01"
                />
              </div>
      
              {method === "bank" && (
                <>
                  <div>
                    <label className="block text-gray-700 mb-1">Account Number</label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full border p-2 rounded"
                      required
                      disabled={user.kycVerified === "false"}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full border p-2 rounded"
                      required
                      disabled={user.kycVerified === "false"}
                    />
                  </div>
                </>
              )}
      
              {method === "crypto" && (
                <>
                  <div>
                    <label className="block text-gray-700 mb-1">Cryptocurrency</label>
                    <select
                      value={cryptoType}
                      onChange={(e) =>
                        setCryptoType(e.target.value as "BTC" | "ETH" | "USDT")
                      }
                      className="w-full border p-2 rounded"
                      disabled={user.kycVerified === "false"}
                    >
                      <option value="BTC">Bitcoin (BTC)</option>
                      <option value="ETH">Ethereum (ETH)</option>
                      <option value="USDT">Tether (USDT)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Wallet Address</label>
                    <input
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="w-full border p-2 rounded"
                      required
                      disabled={user.kycVerified === "false"}
                    />
                  </div>
                </>
              )}
      
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                disabled={loading || user.kycVerified === "false"}
              >
                {loading && (
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 11-8 8z"
                    />
                  </svg>
                )}
                {loading ? "Submitting..." : "Submit Withdrawal"}
              </button>
            </form>
      
    </div>
  );
};

export default UserEdit;
