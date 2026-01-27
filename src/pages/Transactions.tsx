import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";
import axios from "axios";
import { formatter } from "../utils/utils";

const productionUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:7000/api"
    : "https://brokers-backend-h2nt.onrender.com/api";

interface ApiTransaction {
  _id: string;
  amount: number;
  createdAt?: string;
  updatedAt?: string;
  status: string;
}

interface Transaction {
  id: string;
  type: "Investment" | "Withdrawal" | "Deposit";
  amount: number;
  date: string;
  status: string;
}

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const itemsPerPage = 5;

  const user = useAppSelector((state) => state.userState.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    const fetchTransactions = async (): Promise<void> => {
      try {
        const [investmentRes, withdrawRes, depositRes] = await Promise.all([
          axios.get<{ investments: ApiTransaction[] }>(
            `${productionUrl}/investment/my-investments`,
            { headers: { Authorization: `Bearer ${user?.token}` } }
          ),
          axios.get<{ withdraws: ApiTransaction[] }>(
            `${productionUrl}/withdraws/me`,
            { headers: { Authorization: `Bearer ${user?.token}` } }
          ),
          axios.get<{ deposits: ApiTransaction[] }>(
            `${productionUrl}/deposit`,
            { headers: { Authorization: `Bearer ${user?.token}` } }
          ),
        ]);

        const investments: Transaction[] = investmentRes.data.investments.map(
          (item) => ({
            id: item._id,
            type: "Investment",
            amount: item.amount,
            date: new Date(item.createdAt ?? Date.now()).toLocaleDateString(),
            status: item.status,
          })
        );

        const withdrawals: Transaction[] = withdrawRes.data.withdraws.map(
          (item) => ({
            id: item._id,
            type: "Withdrawal",
            amount: item.amount,
            date: new Date(item.updatedAt ?? Date.now()).toLocaleDateString(),
            status: item.status,
          })
        );

        const deposits: Transaction[] = depositRes.data.deposits.map(
          (item) => ({
            id: item._id,
            type: "Deposit",
            amount: item.amount,
            date: new Date(item.createdAt ?? Date.now()).toLocaleDateString(),
            status: item.status,
          })
        );

        const allTransactions: Transaction[] = [
          ...investments,
          ...withdrawals,
          ...deposits,
        ].sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });

        setTransactions(allTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    if (user?.token) {
      fetchTransactions();
    }
  }, [user?.token]);

  const filteredTransactions = transactions.filter((tx) =>
    tx.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // === PRINT CURRENT PAGE ONLY ===
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const tableHtml = `
      <html>
        <head>
          <title>Transactions - Page ${currentPage}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #333; padding: 8px; text-align: left; }
            th { background: #f2c94c; }
          </style>
        </head>
        <body>
          <h2>Transactions - Page ${currentPage}</h2>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${currentTransactions
                .map(
                  (tx) => `
                <tr>
                  <td>${tx.type}</td>
                  <td>${formatter.format(tx.amount)}</td>
                  <td>${tx.date}</td>
                  <td>${tx.status}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(tableHtml);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="p-6 bg-gradient-to-br from-black via-gray-900 to-yellow-900 min-h-screen text-white">
      <div className="max-w-5xl mx-auto">
        {transactions.length > 0 ? (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
              <h3 className="text-xl font-bold text-yellow-400">
                Transaction History
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search by type..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border border-yellow-500 rounded-lg text-sm bg-black text-yellow-300 placeholder-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  onClick={handlePrint}
                  className="px-3 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400"
                >
                  Print Page
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="bg-yellow-900/50 text-left text-yellow-300 uppercase text-xs">
                    <th className="p-3">Type</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-yellow-700 hover:bg-yellow-900/20"
                    >
                      <td className="p-3">{tx.type}</td>
                      <td className="p-3">{formatter.format(tx.amount)}</td>
                      <td className="p-3">{tx.date}</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                            tx.status === "approved"
                              ? "bg-green-200 text-green-900"
                              : tx.status === "pending"
                              ? "bg-yellow-200 text-yellow-900"
                              : "bg-red-200 text-red-900"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-4 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-yellow-500 rounded text-yellow-300 hover:bg-yellow-500 hover:text-black disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm text-yellow-200">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-yellow-500 rounded text-yellow-300 hover:bg-yellow-500 hover:text-black disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div className="text-yellow-200 text-sm mt-6">
            No recent transactions to display.
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
