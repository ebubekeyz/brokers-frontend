// src/pages/AdminDashboard.tsx
import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

interface User {
  id: number;
  name: string;
  email: string;
  status: "active" | "suspended";
  portfolioValue: number;
}

const Landing: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Alice", email: "alice@example.com", status: "active", portfolioValue: 45000 },
    { id: 2, name: "Bob", email: "bob@example.com", status: "suspended", portfolioValue: 12000 },
    { id: 3, name: "Charlie", email: "charlie@example.com", status: "active", portfolioValue: 78000 },
  ]);

  const toggleUserStatus = (id: number) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === id
          ? { ...user, status: user.status === "active" ? "suspended" : "active" }
          : user
      )
    );
  };

  const marketData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Market Index",
        data: [3500, 3550, 3520, 3580, 3600],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.3)",
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Market Overview */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
          <Line data={marketData} />
        </CardContent>
      </Card>

      {/* User Management */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Portfolio Value</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-t">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.status}</td>
                  <td className="p-2">${user.portfolioValue.toLocaleString()}</td>
                  <td className="p-2">
                    <Button
                      variant={user.status === "active" ? "destructive" : "default"}
                      onClick={() => toggleUserStatus(user.id)}
                    >
                      {user.status === "active" ? "Suspend" : "Activate"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Advisory Requests */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Advisory Requests</h2>
          <ul className="list-disc pl-6">
            <li>Request from Alice - Retirement Planning</li>
            <li>Request from Bob - Wealth Management</li>
            <li>Request from Charlie - Crypto Portfolio Strategy</li>
          </ul>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Platform Settings</h2>
          <Button className="mr-2">Update Fees</Button>
          <Button className="mr-2">Manage Products</Button>
          <Button variant="destructive">Compliance Notice</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Landing;

