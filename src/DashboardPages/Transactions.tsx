import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";
import axios from "axios";
import { formatter } from "../utils/utils";
import Swal from "sweetalert2";

const productionUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:7000/api"
    : "https://brokers-backend-hbq6.onrender.com/api";

interface Transaction {
  id: string;
  type: "Investment" | "Withdrawal" | "Deposit";
  amount: number;
  date: string;
  status: string;
  name: string;
}

interface ApiUser {
  _id: string;
  fullName?: string;
}

interface ApiTransaction {
  _id: string;
  amount: number;
  createdAt?: string;
  updatedAt?: string;
  status: string;
  user?: ApiUser;
}

interface InvestmentResponse {
  investments: ApiTransaction[];
}

interface WithdrawalResponse {
  withdraws: ApiTransaction[];
}

interface DepositResponse {
  deposits: ApiTransaction[];
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
    const fetchTransactions = async () => {
      try {
        const [investmentRes, withdrawRes, depositRes] = await Promise.all([
          axios.get<InvestmentResponse>(`${productionUrl}/investment`, {
            headers: { Authorization: `Bearer ${user?.token}` },
          }),
          axios.get<WithdrawalResponse>(`${productionUrl}/withdraws`, {
            headers: { Authorization: `Bearer ${user?.token}` },
          }),
          axios.get<DepositResponse>(`${productionUrl}/deposit/admin`, {
            headers: { Authorization: `Bearer ${user?.token}` },
          }),
        ]);

        const investments: Transaction[] = investmentRes.data.investments.map(
          (item) => ({
            id: item._id,
            type: "Investment",
            amount: item.amount,
            date: new Date(item.createdAt ?? Date.now()).toLocaleDateString(),
            status: item.status,
            name: item.user?.fullName || "Unknown User",
          })
        );

        const withdrawals: Transaction[] = withdrawRes.data.withdraws.map(
          (item) => ({
            id: item._id,
            type: "Withdrawal",
            amount: item.amount,
            date: new Date(item.updatedAt ?? Date.now()).toLocaleDateString(),
            status: item.status,
            name: item.user?.fullName || "Unknown User",
          })
        );

        const deposits: Transaction[] = depositRes.data.deposits.map(
          (item) => ({
            id: item._id,
            type: "Deposit",
            amount: item.amount,
            date: new Date(item.createdAt ?? Date.now()).toLocaleDateString(),
            status: item.status,
            name: item.user?.fullName || "Unknown User",
          })
        );

        const allTransactions = [...investments, ...withdrawals, ...deposits].sort(
          (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setTransactions(allTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    if (user?.token) fetchTransactions();
  }, [user?.token, user]);

  const filteredTransactions = transactions.filter((tx) =>
    tx.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const showAlert = (title: string, icon: any) => {
    Swal.fire({
      title,
      icon,
      background: "#111",
      color: "#fff",
      confirmButtonColor: "#f4b400",
    });
  };

  const approveInvestment = (id: string) =>
    axios.patch(
      `${productionUrl}/investment/approve/${id}`,
      {},
      { headers: { Authorization: `Bearer ${user?.token}` } }
    );

  const approveWithdrawal = (id: string) =>
    axios.patch(
      `${productionUrl}/withdraws/approve/${id}`,
      {},
      { headers: { Authorization: `Bearer ${user?.token}` } }
    );

  const approveDeposit = (id: string) =>
    axios.patch(
      `${productionUrl}/deposit/approve/${id}`,
      {},
      { headers: { Authorization: `Bearer ${user?.token}` } }
    );

  const handleApprove = async (tx: Transaction) => {
    try {
      if (tx.type === "Investment") await approveInvestment(tx.id);
      else if (tx.type === "Withdrawal") await approveWithdrawal(tx.id);
      else await approveDeposit(tx.id);

      setTransactions((prev) =>
        prev.map((item) =>
          item.id === tx.id ? { ...item, status: "approved" } : item
        )
      );

      showAlert(`${tx.type} Approved ✅`, "success");
    } catch {
      showAlert("Failed to approve", "error");
    }
  };

  const rejectInvestment = (id: string) =>
    axios.patch(
      `${productionUrl}/investment/reject/${id}`,
      {},
      { headers: { Authorization: `Bearer ${user?.token}` } }
    );

  const rejectWithdrawal = (id: string) =>
    axios.patch(
      `${productionUrl}/withdraws/reject/${id}`,
      {},
      { headers: { Authorization: `Bearer ${user?.token}` } }
    );

  const rejectDeposit = (id: string) =>
    axios.patch(
      `${productionUrl}/deposit/reject/${id}`,
      {},
      { headers: { Authorization: `Bearer ${user?.token}` } }
    );

  const handleReject = async (tx: Transaction) => {
    try {
      if (tx.type === "Investment") await rejectInvestment(tx.id);
      else if (tx.type === "Withdrawal") await rejectWithdrawal(tx.id);
      else await rejectDeposit(tx.id);

      setTransactions((prev) =>
        prev.map((item) =>
          item.id === tx.id ? { ...item, status: "rejected" } : item
        )
      );

      showAlert(`${tx.type} Rejected ❌`, "warning");
    } catch {
      showAlert("Failed to reject", "error");
    }
  };

  const handleDelete = async (tx: Transaction) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      background: "#111",
      color: "#fff",
      confirmButtonColor: "#f4b400",
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let endpoint = "";
          if (tx.type === "Investment")
            endpoint = `${productionUrl}/investment/delete/${tx.id}`;
          else if (tx.type === "Withdrawal")
            endpoint = `${productionUrl}/withdraws/delete/${tx.id}`;
          else endpoint = `${productionUrl}/deposit/delete/${tx.id}`;

          await axios.delete(endpoint, {
            headers: { Authorization: `Bearer ${user?.token}` },
          });

          setTransactions((prev) => prev.filter((item) => item.id !== tx.id));
          showAlert("Deleted successfully", "success");
        } catch {
          showAlert("Failed to delete", "error");
        }
      }
    });
  };

  const handleView = (tx: Transaction) => {
    if (tx.type === "Investment")
      navigate(`/adminDashboard/viewInvestment/${tx.id}`);
    else if (tx.type === "Withdrawal")
      navigate(`/adminDashboard/viewWithdrawal/${tx.id}`);
    else navigate(`/adminDashboard/viewDeposit/${tx.id}`);
  };

  const handleEdit = (tx: Transaction) => {
    if (tx.type === "Investment")
      navigate(`/adminDashboard/editInvestment/${tx.id}`);
    else if (tx.type === "Withdrawal")
      navigate(`/adminDashboard/editWithdrawal/${tx.id}`);
    else navigate(`/adminDashboard/editDeposit/${tx.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen font-sans bg-[#0b0b0f] text-white">
      {transactions.length > 0 ? (
        <div className="bg-[#111] p-6 rounded-xl shadow-lg border border-[#2a2a2f]">
          <div className="grid grid-cols-1 lg:flex lg:justify-between lg:items-center mb-6">
            <h3 className="text-xl font-semibold text-gold">📜 Recent Transactions</h3>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-[#1a1a1f] border border-[#333] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold text-white"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1a1a1f] text-left uppercase text-xs text-gray-400">
                  <th className="p-3">Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-[#222] hover:bg-[#151519] transition">
                    <td className="p-3">{tx.name}</td>
                    <td className="p-3 font-semibold text-gold">{tx.type}</td>
                    <td className="p-3">{formatter.format(tx.amount)}</td>
                    <td className="p-3">{tx.date}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          tx.status === "approved"
                            ? "bg-green-900 text-green-300"
                            : tx.status === "rejected"
                            ? "bg-red-900 text-red-300"
                            : "bg-yellow-900 text-yellow-300"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-3 space-x-2">
                      {tx.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(tx)}
                            className="px-2 py-1 text-green-400 border border-green-400 rounded hover:bg-green-900 text-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(tx)}
                            className="px-2 py-1 text-red-400 border border-red-400 rounded hover:bg-red-900 text-xs"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleView(tx)}
                        className="px-2 py-1 text-blue-400 border border-blue-400 rounded hover:bg-blue-900 text-xs"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(tx)}
                        className="px-2 py-1 text-yellow-400 border border-yellow-400 rounded hover:bg-yellow-900 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(tx)}
                        className="px-2 py-1 text-red-400 border border-red-400 rounded hover:bg-red-900 text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-600 rounded disabled:opacity-50 hover:bg-[#1a1a1f]"
            >
              Prev
            </button>
            <span className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-600 rounded disabled:opacity-50 hover:bg-[#1a1a1f]"
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div className="text-gray-500 text-sm mt-6">
          No recent transactions to display.
        </div>
      )}
    </div>
  );
};

export default Transactions;
