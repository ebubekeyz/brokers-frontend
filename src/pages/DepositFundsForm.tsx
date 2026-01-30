import { useEffect, useState } from "react";
import { useAppSelector } from "../hooks";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { formatter } from "../utils/utils";

const productionUrl =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:7000/api'
    : 'https://brokers-backend-h2nt.onrender.com/api';

interface InvestmentItem {
  label: string;
  price: number;
  percentage: number;
}

const investmentOptions: Record<string, InvestmentItem[]> = {
  gold: [
  { label: "Gold Starter", price: 250, percentage: 5 },
  { label: "Gold Basic", price: 500, percentage: 10 },
  { label: "Gold Premium", price: 950, percentage: 12 },
  { label: "Gold Elite", price: 1000, percentage: 18 },
      { label: "Gold Bullion (50oz)", price: 1500, percentage: 20 },
      { label: "Gold ETF", price: 2000, percentage: 25 },
      { label: "Gold Mining Stocks", price: 2500, percentage: 30 },
    ],
    crypto: [
      { label: "Bitcoin (BTC)", price: 300, percentage: 10 },
      { label: "Ethereum (ETH)", price: 1000, percentage: 15},
      { label: "Solana (SOL)", price: 5000, percentage: 25 },
    ],
    hybrid: [
      { label: "50% Gold + 50% BTC", price: 10000, percentage: 30 },
      { label: "Gold & Crypto Balanced Fund", price: 20000, percentage: 50 },
    ],
};

interface User {
  token: string;
}

interface UserData {
  user: {
    accountBalance: number;
    kycVerified: string;
  };
  msg?: string;
}

const DepositFundsForm: React.FC = () => {
  const user = useAppSelector((state) => state.userState.user) as User | null;
  const navigate = useNavigate();

  const [investmentType, setInvestmentType] = useState<string>('');
  const [investmentItem, setInvestmentItem] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [accountBalance, setAccountBalance] = useState<number>(0);
  const [durationType, setDurationType] = useState<string>('');
  const [durationValue, setDurationValue] = useState<string>('');
  const [kycVerified, setkycVerified] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const res = await fetch(`${productionUrl}/auth/me`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });

        const data: UserData = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Failed to fetch user');

        setAccountBalance(data.user.accountBalance ?? 0);
        setkycVerified(data.user.kycVerified ?? 'false');
      } catch (err) {
        const error = err as Error;
        console.error(error.message || 'Failed to fetch user balance');
      }
    };

    fetchUserDetails();
  }, [user, navigate]);

  const getMinimumAmount = (): number => {
    if (!investmentType || !investmentItem) return 0;
    const item = investmentOptions[investmentType]?.find(i => i.label === investmentItem);
    return item ? item.price : 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (kycVerified === 'false') {
      setErrorMessage('Your account is suspended. Please contact the support team to resolve this.');
      return;
    }

    const minAmount = getMinimumAmount();
    const enteredAmount = parseFloat(amount);

    if (isNaN(enteredAmount)) {
      setErrorMessage('Please enter a valid amount.');
      return;
    }

    if (enteredAmount < minAmount) {
      setErrorMessage(`Minimum investment for ${investmentItem} is ${formatter.format(minAmount)}`);
      return;
    }

    if (enteredAmount > accountBalance) {
      setErrorMessage(`Amount exceeds available account balance of ${formatter.format(accountBalance)}`);
      return;
    }

    if (!durationType || !durationValue || isNaN(parseInt(durationValue)) || parseInt(durationValue) < 1) {
      setErrorMessage('Please select a valid duration.');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      const res = await fetch(`${productionUrl}/investment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          investmentType,
          investmentItem,
          amount: enteredAmount,
          note,
          durationType,
          durationValue: parseInt(durationValue),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.msg || 'Failed to submit');

      toast.success('Investment submitted successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (kycVerified === null) {
    return <span className="loading loading-spinner loading-sm"></span>;
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="max-w-3xl mx-auto">
         <ToastContainer />
      
      <h1 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-300">
        Invest in Gold & Crypto
      </h1>
      <p className="text-gray-300 mb-6">
        Secure your wealth with premium gold and cutting-edge cryptocurrencies. Choose your investment type and grow your portfolio.
      </p>

      {kycVerified === 'false' && (
        <div className="mb-6 p-4 border border-red-500 bg-red-900 text-red-200 rounded">
          Your account has been suspended. Please contact the support team for assistance.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 shadow-xl rounded-lg px-8 pt-6 pb-8"
      >
        {/* Investment Type */}
        <div className="mb-4">
          <label className="block text-yellow-400 text-sm font-semibold mb-2">Investment Category</label>
          <select
            value={investmentType}
            onChange={(e) => {
              setInvestmentType(e.target.value);
              setInvestmentItem('');
              setErrorMessage('');
            }}
            className="w-full border border-yellow-500 rounded px-3 py-2 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
            disabled={kycVerified === 'false'}
          >
            <option value="">-- Select --</option>
            <option value="gold">Gold Investments</option>
            <option value="crypto">Cryptocurrency</option>
            <option value="hybrid">Hybrid Gold + Crypto</option>
          </select>
        </div>

        {/* Investment Item */}
        {investmentType && (
          <div className="mb-4">
            <label className="block text-yellow-400 text-sm font-semibold mb-2">Investment Option</label>
            <select
              value={investmentItem}
              onChange={(e) => {
                setInvestmentItem(e.target.value);
                setErrorMessage('');
              }}
              className="w-full border border-yellow-500 rounded px-3 py-2 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
              disabled={kycVerified === 'false'}
            >
              <option value="">-- Select --</option>
              {investmentOptions[investmentType]?.map((item) => (
                <option key={item.label} value={item.label}>
                  {item.label} — ${item.price.toLocaleString()} — {item.percentage}% ROI
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Amount */}
        <div className="mb-4">
          <label className="block text-yellow-400 text-sm font-semibold mb-2">Amount (USD)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full border border-yellow-500 rounded px-3 py-2 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
            disabled={kycVerified === 'false'}
          />
        </div>

        {/* Duration */}
        <div className="mb-4">
          <label className="block text-yellow-400 text-sm font-semibold mb-2">Duration Type</label>
          <select
            value={durationType}
            onChange={(e) => {
              setDurationType(e.target.value);
              setDurationValue('');
            }}
            className="w-full border border-yellow-500 rounded px-3 py-2 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
            disabled={kycVerified === 'false'}
          >
            <option value="">-- Select --</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {durationType && (
          <div className="mb-4">
            <label className="block text-yellow-400 text-sm font-semibold mb-2">
              {durationType === 'monthly' ? 'Number of Months' : 'Number of Years'}
            </label>
            <input
              type="number"
              min={1}
              value={durationValue}
              onChange={(e) => setDurationValue(e.target.value)}
              placeholder={`Enter ${durationType === 'monthly' ? 'months' : 'years'}`}
              className="w-full border border-yellow-500 rounded px-3 py-2 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
              disabled={kycVerified === 'false'}
            />
          </div>
        )}

        {/* Note */}
        <div className="mb-4">
          <label className="block text-yellow-400 text-sm font-semibold mb-2">Note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note..."
            className="w-full border border-yellow-500 rounded px-3 py-2 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            disabled={kycVerified === 'false'}
          />
        </div>

        {errorMessage && (
          <p className="text-red-400 text-sm mt-1 mb-4">{errorMessage}</p>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-300 text-black font-bold py-2 rounded-lg hover:scale-[1.02] transition"
          disabled={loading || kycVerified === 'false'}
        >
          {loading ? "Processing..." : "Submit Investment"}
        </button>
      </form>
     </div>
    </div>
  );
};

export default DepositFundsForm;
