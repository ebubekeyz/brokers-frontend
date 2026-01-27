import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { initTransak } from "./services/transak";
import { Button } from "../components/ui/button";
import TransakWidget from "./TransakWidget";





// UserDashboard_v2.tsx
// TypeScript + React single-file dashboard prototype
// Features: Stocks & ETF brokerage, Forex & Commodities, Retirement Planning,
// Wealth Management, Crypto Brokerage, Financial Advisory.
// Styling uses Tailwind CSS utility classes (assumes Tailwind configured).

type AssetType = "stock" | "etf" | "forex" | "commodity" | "crypto";

interface Holding {
  id: string;
  name: string;
  ticker: string;
  assetType: AssetType;
  units: number;
  avgPrice: number;
  currentPrice: number;
}

const SAMPLE_HOLDINGS: Holding[] = [
  { id: "1", name: "Acme Corp", ticker: "ACME", assetType: "stock", units: 120, avgPrice: 22.5, currentPrice: 28.3 },
  { id: "2", name: "Global Tech ETF", ticker: "GTE", assetType: "etf", units: 40, avgPrice: 150, currentPrice: 162 },
  { id: "3", name: "EUR/USD", ticker: "EURUSD", assetType: "forex", units: 10000, avgPrice: 1.08, currentPrice: 1.09 },
  { id: "4", name: "Gold", ticker: "XAU", assetType: "commodity", units: 2, avgPrice: 1900, currentPrice: 1965 },
  { id: "5", name: "BitExample", ticker: "BTX", assetType: "crypto", units: 3.5, avgPrice: 34000, currentPrice: 41000 },
];

const priceHistory = [
  { time: "09:00", value: 100 },
  { time: "10:00", value: 102 },
  { time: "11:00", value: 101 },
  { time: "12:00", value: 104 },
  { time: "13:00", value: 107 },
  { time: "14:00", value: 106 },
  { time: "15:00", value: 108 },
];

const Dashboard:React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  const [query, setQuery] = useState("");
  const [holdings, setHoldings] = useState<Holding[]>(SAMPLE_HOLDINGS);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeAsset, setTradeAsset] = useState<Partial<Holding> | null>(null);

  const filtered = useMemo(() => {
    if (!query) return holdings;
    return holdings.filter((h) => h.name.toLowerCase().includes(query.toLowerCase()) || h.ticker.toLowerCase().includes(query.toLowerCase()));
  }, [holdings, query]);

  const portfolioValue = useMemo(() => holdings.reduce((s, h) => s + h.units * h.currentPrice, 0), [holdings]);
  const pnl = useMemo(() => holdings.reduce((s, h) => s + h.units * (h.currentPrice - h.avgPrice), 0), [holdings]);

  function openTrade(asset?: Holding) {
    setTradeAsset(asset ?? null);
    setShowTradeModal(true);
  }

  function executeTrade(type: "buy" | "sell", qty: number) {
    if (!tradeAsset) return;
    setHoldings((prev) => {
      const found = prev.find((p) => p.ticker === tradeAsset.ticker);
      if (found) {
        return prev.map((p) => {
          if (p.ticker !== tradeAsset.ticker) return p;
          const units = type === "buy" ? p.units + qty : Math.max(0, p.units - qty);
          const avgPrice = type === "buy" ? (p.avgPrice * p.units + (tradeAsset.currentPrice ?? p.currentPrice) * qty) / (p.units + qty) : p.avgPrice;
          return { ...p, units, avgPrice };
        });
      }
      return [
        ...prev,
        {
          id: String(prev.length + 1),
          name: tradeAsset.name ?? "New Asset",
          ticker: tradeAsset.ticker ?? "NEW",
          assetType: (tradeAsset.assetType ?? "stock") as AssetType,
          units: qty,
          avgPrice: tradeAsset.currentPrice ?? 0,
          currentPrice: tradeAsset.currentPrice ?? 0,
        },
      ];
    });
    setShowTradeModal(false);
    setTradeAsset(null);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="grid grid-cols-1 lg:flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, Investor 👋</h1>
            <p className="text-sm text-gray-500">Consolidated brokerage & planning dashboard</p>
          </div>

          <div className="lg:flex items-center gap-4 mt-4 lg:mt-0">
            <div className="lg:text-right">
              <div className="text-lg font-semibold">Net Worth</div>
              <div className="text-xl text-indigo-600 font-bold">${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            </div>
            <button onClick={() => openTrade()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg mt-2 lg:mt-0">Quick Trade</button>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="col-span-8">
            <nav className="mb-4 flex flex-wrap gap-2">
              {[
                { id: "overview", label: "Overview" },
                { id: "markets", label: "Markets" },
                { id: "planning", label: "Retirement & Planning" },
                { id: "advisory", label: "Advisory" },
              ].map((tab) => (
                <button key={tab.id} onClick={() => setSelectedTab(tab.id)} className={`px-3 py-1 rounded-md font-medium ${selectedTab === tab.id ? "bg-indigo-600 text-white" : "bg-white text-gray-700"}`}>
                  {tab.label}
                </button>
              ))}
            </nav>

            <motion.div key={selectedTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-6">
              {selectedTab === "overview" && (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-white rounded-2xl shadow">
                      <div className="text-sm text-gray-500">Portfolio Value</div>
                      <div className="text-2xl font-bold">${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                      <div className="text-sm mt-2 text-gray-600">P&L: ${pnl.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                    </div>
                    <div className="p-4 bg-white rounded-2xl shadow">
                      <div className="text-sm text-gray-500">Cash Balance</div>
                      <div className="text-2xl font-bold">$12,450</div>
                      <div className="text-sm mt-2 text-gray-600">Available to trade</div>
                    </div>
                    <div className="p-4 bg-white rounded-2xl shadow">
                      <div className="text-sm text-gray-500">Open Orders</div>
                      <div className="text-2xl font-bold">2</div>
                      <div className="text-sm mt-2 text-gray-600">Pending executions</div>
                    </div>
                  </div>

                  <div className="mt-4 bg-white rounded-2xl shadow p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">Portfolio performance</h3>
                      <div className="text-sm text-gray-500">Last 7 intervals</div>
                    </div>
                    <div style={{ width: "100%", height: 240 }}>
                      <ResponsiveContainer>
                        <LineChart data={priceHistory}>
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-4 shadow">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold">Top Holdings</h4>
                        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or ticker" className="border rounded px-2 py-1 text-sm" />
                      </div>

                      <div className="space-y-3 max-h-72 overflow-auto">
                        {filtered.map((h) => (
                          <div key={h.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                            <div>
                              <div className="font-medium">{h.name} <span className="text-xs text-gray-400">({h.ticker})</span></div>
                              <div className="text-xs text-gray-500">{h.units} units • Avg ${h.avgPrice} • Current ${h.currentPrice}</div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => openTrade(h)} className="px-3 py-1 rounded bg-green-50 text-green-700 text-sm">Trade</button>
                              <button className="px-3 py-1 rounded bg-gray-100 text-gray-700 text-sm">Details</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold">Asset Allocation</h4>
                        <div className="text-sm text-gray-500">By market value</div>
                      </div>

                      <div style={{ height: 220 }}>
                        <ResponsiveContainer>
                          <BarChart data={aggregateByAsset(holdings)}>
                            <XAxis dataKey="assetType" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {selectedTab === "markets" && (
                <div className="bg-white rounded-2xl p-6 shadow">
                  <h3 className="font-semibold mb-4">Markets — stocks, ETF, forex, commodities, crypto</h3>
                  <p className="text-sm text-gray-500 mb-4">Live market quotes, watchlists and quick trade actions (demo data).</p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="p-4 border rounded">
                      <h5 className="font-medium mb-2">Watchlist</h5>
                      <ul className="space-y-2 text-sm">
                        {holdings.map((h) => (
                          <li key={h.id} className="flex justify-between">
                            <div>
                              <div className="font-medium">{h.ticker}</div>
                              <div className="text-xs text-gray-500">{h.name}</div>
                            </div>
                            <div className="text-right">
                              <div>${h.currentPrice}</div>
                              <div className="text-xs text-gray-500">{getChangeIndicator(h)}</div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 border rounded">
                      <h5 className="font-medium mb-2">Quick FX & Commodities</h5>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {holdings.filter(h => h.assetType === 'forex' || h.assetType === 'commodity').map(h => (
                          <div key={h.id} className="p-2 border rounded flex justify-between items-center">
                            <div>
                              <div className="font-medium">{h.ticker}</div>
                              <div className="text-xs text-gray-500">{h.name}</div>
                            </div>
                            <div className="text-right">
                              <div>${h.currentPrice}</div>
                              <button onClick={() => openTrade(h)} className="mt-1 px-2 py-1 text-xs bg-indigo-50 rounded text-indigo-600">Trade</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === "planning" && (
                <div className="bg-white rounded-2xl p-6 shadow">
                  <h3 className="font-semibold mb-3">Retirement planning & wealth goals</h3>
                  <p className="text-sm text-gray-500 mb-4">Project future value, set risk tolerance and schedule contributions.</p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="p-4 border rounded">
                      <h5 className="font-medium mb-2">Retirement projection</h5>
                      <ProjectionWidget initialBalance={25000} monthlyContribution={500} years={25} />
                    </div>

                    <div className="p-4 border rounded">
                      <h5 className="font-medium mb-2">Goal tracker</h5>
                      <div className="space-y-3 text-sm">
                        <GoalRow name="Emergency Fund" target={10000} current={4200} />
                        <GoalRow name="Kids College" target={50000} current={8000} />
                        <GoalRow name="House Downpayment" target={80000} current={15000} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === "advisory" && (
                <div className="bg-white rounded-2xl p-6 shadow">
                  <h3 className="font-semibold mb-3">Financial advisory & wealth management</h3>
                  <p className="text-sm text-gray-500 mb-4">Connect with advisors, review recommendations and compliance documents.</p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="p-4 border rounded">
                      <h5 className="font-medium mb-2">Recommended portfolio</h5>
                      <ol className="list-decimal list-inside text-sm space-y-2">
                        <li>60% Diversified ETFs</li>
                        <li>15% Global equities</li>
                        <li>10% Commodities (gold)</li>
                        <li>10% Cash & short-term</li>
                        <li>5% Opportunistic crypto</li>
                      </ol>
                    </div>

                    <div className="p-4 border rounded">
                      <h5 className="font-medium mb-2">Advisor chat</h5>
                      <p className="text-xs text-gray-500">You can schedule or message your assigned advisor. (Demo mode — messaging not connected.)</p>
                      <div className="mt-3">
                        <button className="px-3 py-1 rounded bg-indigo-600 text-white">Request call</button>
                        <button className="ml-2 px-3 py-1 rounded bg-white border">View plan</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </section>

          <aside className="col-span-8 lg:col-span-4">
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl shadow">
                <h4 className="font-semibold mb-2">Crypto brokerage</h4>
                <p className="text-xs text-gray-500 mb-3">Buy/sell popular tokens instantly with low spreads.</p>
                <div className="grid grid-cols-2 gap-2">
                    <TransakWidget walletAddress="0xYourWalletAddressHere" mode="BUY" />
        <TransakWidget walletAddress="0xYourWalletAddressHere" mode="SELL" />
                 
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow">
                <h4 className="font-semibold mb-2">Retirement quick inputs</h4>
                <p className="text-xs text-gray-500">Adjust contributions & risk to see impact.</p>
                <div className="mt-3 flex gap-2">
                  <button className="px-2 py-1 rounded border">Contribute</button>
                  <button className="px-2 py-1 rounded border">Change risk</button>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow">
                <h4 className="font-semibold mb-2">Advisory notes</h4>
                <p className="text-xs text-gray-500">Recent recommendations</p>
                <ul className="text-sm mt-2 space-y-2">
                  <li>Rebalance to target allocation</li>
                  <li>Increase emergency fund to 6 months</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow">
                <h4 className="font-semibold mb-2">Quick actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button className="px-2 py-2 rounded bg-indigo-600 text-white">Deposit</button>
                  <button className="px-2 py-2 rounded border">Withdraw</button>
                  <button className="px-2 py-2 rounded border">Statements</button>
                  <button className="px-2 py-2 rounded border">Support</button>
                </div>
              </div>
            </div>
          </aside>
        </main>

        {showTradeModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="w-[520px] bg-white rounded-2xl p-6">
              <h3 className="font-semibold mb-2">{tradeAsset ? `Trade ${tradeAsset.ticker}` : "Quick Trade"}</h3>
              <p className="text-sm text-gray-500 mb-4">Execute a mock buy/sell (demo only)</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600">Type</label>
                  <select id="trade-type" className="w-full border rounded px-2 py-1 mt-1 text-sm">
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-600">Quantity</label>
                  <input id="trade-qty" type="number" defaultValue={1} className="w-full border rounded px-2 py-1 mt-1 text-sm" />
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => { setShowTradeModal(false); setTradeAsset(null); }} className="px-3 py-1 rounded border">Cancel</button>
                <button onClick={() => {
                  const typeSelect = document.getElementById("trade-type") as HTMLSelectElement | null;
                  const qtyInput = document.getElementById("trade-qty") as HTMLInputElement | null;
                  const type = (typeSelect?.value as "buy" | "sell") ?? "buy";
                  const qty = Number(qtyInput?.value ?? 1);
                  executeTrade(type, qty);
                }} className="px-3 py-1 rounded bg-indigo-600 text-white">Execute</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Helper components & functions ---------- */

function aggregateByAsset(holdings: Holding[]) {
  const map = new Map<string, number>();
  holdings.forEach((h) => {
    const key = h.assetType;
    const value = h.units * h.currentPrice;
    map.set(key, (map.get(key) ?? 0) + value);
  });
  return Array.from(map.entries()).map(([assetType, value]) => ({ assetType, value }));
}

function getChangeIndicator(h: Holding) {
  const diff = h.currentPrice - h.avgPrice;
  const pct = ((diff) / h.avgPrice) * 100;
  const sign = diff >= 0 ? "+" : "-";
  return `${sign}$${Math.abs(diff).toFixed(2)} (${sign}${Math.abs(pct).toFixed(2)}%)`;
}

function GoalRow({ name, target, current }: { name: string; target: number; current: number }) {
  const pct = Math.min(100, Math.round((current / target) * 100));
  return (
    <div>
      <div className="flex justify-between text-sm">
        <div>{name}</div>
        <div className="font-medium">${current.toLocaleString()} / ${target.toLocaleString()}</div>
      </div>
      <div className="w-full bg-gray-100 rounded h-2 mt-2 overflow-hidden">
        <div style={{ width: `${pct}%` }} className="h-2 bg-indigo-600"></div>
      </div>
    </div>
  );
}

function ProjectionWidget({ initialBalance, monthlyContribution, years }: { initialBalance: number; monthlyContribution: number; years: number }) {
  const rate = 0.06;
  const months = years * 12;
  let balance = initialBalance;
  const series: { month: number; value: number }[] = [];
  for (let i = 0; i < months; i++) {
    const monthlyRate = Math.pow(1 + rate, 1 / 12) - 1;
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    if (i % Math.max(1, Math.floor(months / 10)) === 0) series.push({ month: i, value: Math.round(balance) });
  }

  return (
    <div>
      <div className="text-sm text-gray-500">Projected value in {years} years</div>
      <div className="text-lg font-bold mt-1">${Math.round(balance).toLocaleString()}</div>
      <div style={{ width: "100%", height: 120 }} className="mt-3">
        <ResponsiveContainer>
          <LineChart data={series}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line dataKey="value" stroke="#6366f1" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


export default Dashboard





