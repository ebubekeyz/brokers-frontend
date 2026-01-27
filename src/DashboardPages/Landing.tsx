import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { useEffect, useState } from "react";
import { FaUsers, FaChartLine, FaClock, FaExchangeAlt, FaCoins } from "react-icons/fa";
import { GiGoldBar } from "react-icons/gi";

const productionUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:7000/api"
    : "https://brokers-backend-hbq6.onrender.com/api";

type User = {
  token: string;
  user: {
    fullName: string;
    id: string;
  };
};

type UserState = {
  userState: {
    user: User | null;
  };
};

type StatsResponse = {
  success: boolean;
  data: {
    totalUsers: number;
    totalTransactions: number;
    pendingApprovals: number;
    analytics: number | string;
  };
};

type TransactionItem = {
  fullName: string;
  amount: number;
};

type TransactionStatus = {
  approved: number;
  pending: number;
  rejected: number;
};

type TransactionStatsResponse = {
  success: boolean;
  data: {
    deposits: TransactionStatus;
    withdraw: TransactionStatus;
    investments: TransactionStatus;
    // recent: {
    //   deposit: TransactionItem;
    //   withdrawal: TransactionItem;
    //   investment: TransactionItem;
    // };
  };
};

const Landing: React.FC = () => {
  const user = useAppSelector((state: UserState) => state.userState.user);
  const navigate = useNavigate();

  const [stats, setStats] = useState<StatsResponse["data"]>({
    totalUsers: 0,
    totalTransactions: 0,
    pendingApprovals: 0,
    analytics: 0,
  });

  const [transactionStats, setTransactionStats] =
    useState<TransactionStatsResponse["data"] | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch(`${productionUrl}/auth/stats`);
        const data: StatsResponse = await res.json();
        if (data.success) setStats(data.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    const fetchTransactionStats = async () => {
      try {
        const res = await fetch(`${productionUrl}/auth/transactions`);
       
        const data: TransactionStatsResponse = await res.json();
         console.log(data)
        if (data.success) setTransactionStats(data.data);
      } catch (error) {
        console.error("Error fetching transaction stats:", error);
      }
    };

    fetchStats();
    fetchTransactionStats();
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <main className="flex-1 p-6 max-w-6xl mx-auto">
        {/* <h1 className="text-4xl font-bold mb-10 text-center">
          <span className="text-yellow-400">Gold</span> &{" "}
          <span className="text-blue-400">Crypto</span> Investment Dashboard
        </h1> */}

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-black/50 backdrop-blur-lg shadow-lg rounded-xl p-6 border border-yellow-500 hover:scale-105 transition">
            <div className="flex items-center gap-3">
              <FaUsers className="text-yellow-400 text-3xl" />
              <h2 className="text-xl font-semibold">Total Users</h2>
            </div>
            <p className="text-3xl font-bold mt-4">{stats.totalUsers}</p>
          </div>

          <div className="bg-black/50 backdrop-blur-lg shadow-lg rounded-xl p-6 border border-blue-500 hover:scale-105 transition">
            <div className="flex items-center gap-3">
              <FaExchangeAlt className="text-blue-400 text-3xl" />
              <h2 className="text-xl font-semibold">Transactions</h2>
            </div>
            <p className="text-3xl font-bold mt-4">{stats.totalTransactions.toLocaleString()}</p>
          </div>

          <div className="bg-black/50 backdrop-blur-lg shadow-lg rounded-xl p-6 border border-green-500 hover:scale-105 transition">
            <div className="flex items-center gap-3">
              <FaChartLine className="text-green-400 text-3xl" />
              <h2 className="text-xl font-semibold">Analytics</h2>
            </div>
            <p className="text-3xl font-bold mt-4">{stats.analytics}%</p>
          </div>

          <div className="bg-black/50 backdrop-blur-lg shadow-lg rounded-xl p-6 border border-red-500 hover:scale-105 transition">
            <div className="flex items-center gap-3">
              <FaClock className="text-red-400 text-3xl" />
              <h2 className="text-xl font-semibold">Pending Approvals</h2>
            </div>
            <p className="text-3xl font-bold mt-4">{stats.pendingApprovals}</p>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="mt-12">
          {/* <h3 className="text-2xl font-semibold mb-4">Recent Activities</h3>
          <div className="bg-black/50 backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700">
            <ul className="space-y-3">
              {transactionStats && (
                <>
                  {transactionStats.recent.deposit.amount > 0 && (
                    <li>💰 {transactionStats.recent.deposit.fullName} funded ${transactionStats.recent.deposit.amount.toLocaleString()} (Deposit)</li>
                  )}
                  {transactionStats.recent.withdrawal.amount > 0 && (
                    <li>🏦 {transactionStats.recent.withdrawal.fullName} withdrew ${transactionStats.recent.withdrawal.amount.toLocaleString()}</li>
                  )}
                  {transactionStats.recent.investment.amount > 0 && (
                    <li>📈 {transactionStats.recent.investment.fullName} invested ${transactionStats.recent.investment.amount.toLocaleString()}</li>
                  )}
                </>
              )}
            </ul>
          </div> */}
        </div>
      </main>
    </div>
  );
};

export default Landing;
