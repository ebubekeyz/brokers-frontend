import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useAppSelector } from "../hooks";

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  kycVerified: string;
}

const UserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>("");

  const token = useAppSelector((state) => state.userState.user?.token);
  const productionUrl =
    import.meta.env.MODE !== "production"
      ? "http://localhost:7000/api"
      : "https://brokers-backend-hbq6.onrender.com/api";

  const fetchUsers = async (): Promise<void> => {
    if (!token) return;
    setLoading(true);

    try {
      const response = await axios.get(
        `${productionUrl}/auth?limit=10&page=${page}&fullName=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(response.data.users);
      setTotalPages(response.data.meta.pagination.pageCount || 1);
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error("Error fetching users:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token, page, search]);

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await axios.delete(`${productionUrl}/auth/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error("Error deleting user:", err.message);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-b from-gray-900 via-black to-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
        Users Management
      </h1>

      {/* Search Bar */}
      <div className="mb-6 max-w-md">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border border-yellow-500 rounded-md focus:ring-2 focus:ring-yellow-400 bg-gray-800 text-white placeholder-gray-400"
        />
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <span className="text-yellow-400 font-semibold animate-pulse">Loading users...</span>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-gray-800 border border-yellow-600 shadow-lg rounded-lg">
            <table className="min-w-full table-auto">
              <thead className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-black">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-t border-yellow-700 hover:bg-yellow-900/20 transition duration-200"
                  >
                    <td className="px-4 py-3">{user._id.slice(-5)}</td>
                    <td className="px-4 py-3 font-medium">{user.fullName}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.role}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.kycVerified === "true"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {user.kycVerified === "false" ? "Inactive" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3 space-x-3">
                      <Link
                        to={`/adminDashboard/userView/${user._id}`}
                        className="text-blue-400 hover:underline text-sm"
                      >
                        View
                      </Link>
                      <Link
                        to={`/adminDashboard/userEdit/${user._id}`}
                        className="text-yellow-400 hover:underline text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-400 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 rounded ${
                    page === p
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-700 text-black font-semibold"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserPage;
