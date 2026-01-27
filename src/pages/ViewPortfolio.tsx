// src/pages/GoldPortfolio.tsx
import React from "react";
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

interface Holding {
  id: number;
  type: string;
  weight: number;
  value: number;
  allocation: number;
}

const holdings: Holding[] = [
  { id: 1, type: "Gold Bullion", weight: 50, value: 120000, allocation: 50 },
  { id: 2, type: "Gold ETF", weight: 30, value: 72000, allocation: 30 },
  { id: 3, type: "Gold Mining Stocks", weight: 20, value: 48000, allocation: 20 },
];

const allocationData = holdings.map(h => ({
  name: h.type,
  value: h.allocation
}));

const COLORS = ["#FFD700", "#DAA520", "#B8860B"];

const performanceData = [
  { month: "Jan", value: 20000 },
  { month: "Feb", value: 21000 },
  { month: "Mar", value: 22000 },
  { month: "Apr", value: 23000 },
  { month: "May", value: 22500 },
  { month: "Jun", value: 24000 },
];

const GoldPortfolio: React.FC = () => {
  const totalValue = holdings.reduce((acc, h) => acc + h.value, 0);
  const gainLoss = ((totalValue - 200000) / 200000) * 100;

  return (
    <div className="p-6 bg-gray-900 text-gray-200 min-h-screen">
      <div className="max-w-5xl mx-auto">
         <h1 className="text-3xl font-bold text-yellow-400 mb-6">
        Gold Investment Portfolio
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 shadow rounded-lg p-4">
          <h2 className="text-gray-400">Total Value</h2>
          <p className="text-2xl font-bold text-yellow-400">
            ${totalValue.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-800 shadow rounded-lg p-4">
          <h2 className="text-gray-400">Gain/Loss</h2>
          <p className={`text-2xl font-bold ${gainLoss >= 0 ? "text-green-400" : "text-red-400"}`}>
            {gainLoss.toFixed(2)}%
          </p>
        </div>
        <div className="bg-gray-800 shadow rounded-lg p-4">
          <h2 className="text-gray-400">Total Weight</h2>
          <p className="text-2xl font-bold text-yellow-400">
            {holdings.reduce((acc, h) => acc + h.weight, 0)} oz
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-300 mb-4">Allocation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", color: "#fbbf24" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-300 mb-4">Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
              <XAxis dataKey="month" stroke="#d1d5db" />
              <YAxis stroke="#d1d5db" />
              <RechartsTooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", color: "#fbbf24" }} />
              <Bar dataKey="value" fill="#FFD700" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-gray-800 shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-300 mb-4">Holdings</h3>
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-2">Type</th>
              <th className="p-2">Weight (oz)</th>
              <th className="p-2">Value (USD)</th>
              <th className="p-2">Allocation</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((h) => (
              <tr key={h.id} className="border-b border-gray-700">
                <td className="p-2">{h.type}</td>
                <td className="p-2">{h.weight}</td>
                <td className="p-2 text-yellow-400">${h.value.toLocaleString()}</td>
                <td className="p-2">{h.allocation}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
     </div>
    </div>
  );
};

export default GoldPortfolio;
