import React, { useEffect, useState,  useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatter } from "../utils/utils";
import TransakWidget from "./TransakWidget";
import Swal from 'sweetalert2'
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { ArrowUpRight, ArrowDownRight, Plus, DollarSign, CandlestickChart, Wallet, BriefcaseBusiness, LineChart as LineChartIcon } from "lucide-react";
import { useAppSelector } from "../hooks";
import axios from "axios";
import { format } from "date-fns";

const productionUrl =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:7000/api'
    : 'https://brokers-backend-h2nt.onrender.com/api';

// -----------------------------------------------------------------------------
// Minimal Card primitives (so this file is drop-in without shadcn/ui)
// -----------------------------------------------------------------------------
const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = "", children }) => (
  <div className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg ${className}`}>{children}</div>
);
const CardHeader: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = "", children }) => (
  <div className={`p-4 md:p-5 border-b border-white/10 ${className}`}>{children}</div>
);
const CardTitle: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = "", children }) => (
  <h3 className={`text-base md:text-lg font-semibold text-white ${className}`}>{children}</h3>
);
const CardContent: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = "", children }) => (
  <div className={`p-4 md:p-5 ${className}`}>{children}</div>
);


interface PricePoint {
  t: string; // time like "09:00"
  btc: number;
}

const CryptoMomentumCard: React.FC = () => {
  const [priceSeries, setPriceSeries] = useState<PricePoint[]>([]);
  const [alertPrice, setAlertPrice] = useState<number | null>(null);
  const [lastPrice, setLastPrice] = useState<number | null>(null);

 const alertPriceRef = useRef<number | null>(null);

useEffect(() => {
  alertPriceRef.current = alertPrice;
}, [alertPrice]);

async function fetchPrices() {
  try {
    const btcResp = await fetch(
      "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1"
    );
    const btcData = await btcResp.json();

    const hourly = btcData.prices
      .filter((_: any, idx: number) => idx % Math.floor(btcData.prices.length / 24) === 0)
      .map((bucket: any) => ({
        t: format(new Date(bucket[0]), "HH:mm"),
        btc: Number(bucket[1].toFixed(2)),
      }));

    setPriceSeries(hourly);

    if (hourly.length > 0) {
      const latest = hourly[hourly.length - 1].btc;
      setLastPrice(latest);

      // ✅ use ref so we don't trigger new effect runs
      if (alertPriceRef.current && latest >= alertPriceRef.current) {
        alert(`BTC has reached your alert price of $${alertPriceRef.current}`);
        setAlertPrice(null);
      }
    }
  } catch (err) {
    console.error("Error fetching BTC prices:", err);
  }
}

useEffect(() => {
  fetchPrices();
  const interval = setInterval(fetchPrices, 60_000);
  return () => clearInterval(interval);
}, []);

  function handleCreateAlert() {
    const price = prompt("Enter BTC price to alert at (USD):");
    if (price && !isNaN(Number(price))) {
      setAlertPrice(Number(price));
      alert(`Alert set at $${price}`);
    }
  }

  return (
    <Card className="bg-black/40 border border-white/10">
       <CardHeader>
              <CardTitle>Signals — Strategy Lab</CardTitle>
            </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="t" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  background: "#0b0b0b",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="btc"
                stroke="#60a5fa"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 flex items-center justify-between text-sm">
          <div className="text-gray-300">
            RSI: <span className="text-white">58</span> • MACD:{" "}
            <span className="text-white">Bullish</span>
          </div>
          <button  onClick={handleCreateAlert} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20">
            Create Alert
          </button>
        </div>
      </CardContent>
    </Card>
  );
};



// const orderBook = [
//   { id: "BG-00121", pair: "BTC/USDT", side: "Buy", type: "Limit", price: 62000, qty: 0.15, filled: 0.05, status: "Open" },
//   { id: "BG-00122", pair: "ETH/USDT", side: "Sell", type: "Market", price: 0, qty: 2.5, filled: 2.5, status: "Filled" },
//   { id: "BG-00123", pair: "SOL/USDT", side: "Buy", type: "Limit", price: 178.5, qty: 20, filled: 0, status: "Open" },
// ];





interface Portfolio {
  name: string;
  value: number;
}

const portfolio: Portfolio[] = [
  { name: "Gold Bullion", value: 120000 },
  { name: "Gold ETF", value: 72000},
  { name: "Gold Mining Stocks",  value: 48000},
];




interface Insight {
  id: number;
  title: string;
  summary: string;
  tags: string[];
}





const insights = [
  {
    id: 1,
    title: "BTC breaks out of consolidation",
    summary: "Price closed above 62k resistance with rising volume; next target 64.5k if momentum holds.",
    tags: ["Technical", "Momentum"],
  },
  {
    id: 2,
    title: "Gold demand steady on central bank purchases",
    summary: "Reserve accumulation continues; dips to 2,350 seen as strategic add zones for long-term portfolios.",
    tags: ["Macro", "Gold"],
  },
  {
    id: 3,
    title: "ETH gas fees easing",
    summary: "Layer-2 throughput keeps costs contained; consider scaling DCA schedule.",
    tags: ["On-chain", "ETH"],
  },
];

const COLORS = ["#facc15", "#60a5fa", "#34d399", "#a78bfa", "#f472b6", "#f59e0b"]; // Tailwind palette vibes

// -----------------------------------------------------------------------------
// Small helpers
// -----------------------------------------------------------------------------
const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  diff?: { pct: number; dir: "up" | "down" } | null;
}> = ({ icon, label, value, diff }) => (
  <Card>
    <CardContent className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">{icon}</div>
      <div className="flex-1">
        <div className="text-sm text-gray-300">{label}</div>
        <div className="text-xl md:text-2xl font-bold text-white">{value}</div>
      </div>
      {diff && (
        <div className={`text-sm font-medium flex items-center gap-1 ${diff.dir === "up" ? "text-emerald-400" : "text-rose-400"}`}>
          {diff.dir === "up" ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
          {diff.pct.toFixed(2)}%
        </div>
      )}
    </CardContent>
  </Card>
);









interface OrdersTableProps {
  orderBook: any[];
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orderBook }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 4;

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orderBook.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(orderBook.length / ordersPerPage);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Open & Recent Orders</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {currentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-gray-300">
            <p className="mb-4"> 🚀 Fund your account, add a wallet, and start trading!</p>
            <Link
              to="/settings"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-semibold shadow-lg transform hover:scale-105 transition duration-300"
            >
              ➕ Add Wallet Address
            </Link>
          </div>
        ) : (
          <>
            <table className="min-w-full text-sm">
              <thead className="text-gray-300">
                <tr className="text-left">
                  <th className="py-2 pr-6">ID</th>
                  <th className="py-2 pr-6">Amount</th>
                  <th className="py-2 pr-6">Pair</th>
                  <th className="py-2 pr-6">Side</th>
                  <th className="py-2 pr-6">Type</th>
                  <th className="py-2 pr-6">Price</th>
                  <th className="py-2 pr-6">Qty</th>
                  <th className="py-2 pr-6">Filled</th>
                  <th className="py-2 pr-6">Status</th>
                  {/* <th className="py-2">Action</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-gray-200">
                {currentOrders.map((o: any) => (
                  <tr key={o.id}>
                    <td className="py-2 pr-6 font-mono">BG-{o.id?.slice(0, 3)}</td>
                    <td className="py-2 pr-6">{formatter.format(o.amount)}</td>
                    <td className="py-2 pr-6">{o.pair}</td>
                    <td className="py-2 pr-6">{o.side}</td>
                    <td className="py-2 pr-6">{o.type}</td>
                    <td className="py-2 pr-6">{o.price ? `${o.price}` : "—"}</td>
                    <td className="py-2 pr-6">{o.qty}</td>
                    <td className="py-2 pr-6">{o.filled}</td>
                    <td className="py-2 pr-6">
                      <span
                        className={`px-2 py-1 rounded-md text-xs ${
                          o.status === "Open"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-emerald-500/20 text-emerald-300"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="py-2">
                      {/* <button className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20">
                        Cancel
                      </button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center mt-4 gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-white/10 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-3 py-1">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-white/10 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};


const BrokerageActions: React.FC = ({cashBalance, Swal}) => (
  <Card>
    <CardHeader>
      <CardTitle>Brokerage — Quick Trade</CardTitle>
    </CardHeader>
    <CardContent className="grid grid-cols-1 gap-3">
      <div className="grid grid-cols-2 gap-3">
        <select className="rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-gray-200">
          <option>BTC/USDT</option>
          <option>ETH/USDT</option>
          <option>SOL/USDT</option>
        </select>
        <select className="rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-gray-200">
          <option>Limit</option>
          <option>Market</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input className="rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-gray-200" placeholder="Price" />
        <input className="rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-gray-200" placeholder="Amount" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        
         {/* <TransakWidget walletAddress="0xYourWalletAddressHere" mode="BUY" />
                <TransakWidget walletAddress="0xYourWalletAddressHere" mode="SELL" /> */}

        <TransakWidget walletAddress="0xYourWalletAddressHere" mode="BUY"  cashBalance={cashBalance} Swal={Swal}/>

        <TransakWidget walletAddress="0xYourWalletAddressHere" mode="SELL" cashBalance={cashBalance} Swal={Swal}/>
    
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Plus size={14} /> Reduce-only • Post-only • TIF
      </div>
    </CardContent>
  </Card>
);


const InsightsFeed: React.FC = () => {
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1"
        );
        const data = await res.json();
       

        const formatted = data.map((coin: any, idx: number) => ({
          id: idx + 1,
          title: `${coin.name} (${coin.symbol.toUpperCase()}) Market Update`,
          summary: `Price: $${coin.current_price.toLocaleString()} | 24h Change: ${coin.price_change_percentage_24h?.toFixed(2)}%`,
          tags: ["Market", coin.symbol.toUpperCase()],
        }));

        setInsights(formatted);
      } catch (error) {
        console.error("Error fetching insights:", error);
      }
    }

    fetchInsights();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Insight — Advisory</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((i) => (
          <div key={i.id} className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-white font-medium">{i.title}</div>
            <div className="text-sm text-gray-300 mt-1">{i.summary}</div>
            <div className="mt-2 flex gap-2 flex-wrap">
              {i.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-0.5 rounded-md bg-white/10 text-gray-300"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
        <button className="w-full mt-2 rounded-xl bg-white/10 hover:bg-white/20 py-2"onClick={() => window.open("https://www.coingecko.com/en", "_blank")}>
          View full research
        </button>
      </CardContent>
    </Card>
  );
};



const PortfolioCard: React.FC = () => {
  const total = portfolio.reduce((a, b) => a + b.value, 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gold & Crypto — Portfolio Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={portfolio} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3}>
                {portfolio.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip contentStyle={{ background: "#0b0b0b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 text-sm text-gray-300">Total value: <span className="text-white font-semibold">${total.toLocaleString()}</span></div>
      </CardContent>
    </Card>
  );
};

const CryptoAnalysisChart: React.FC = () => {
  const [priceSeries, setPriceSeries] = useState<PricePoint[]>([]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
        );
        const data = await res.json();
        const point: PricePoint = {
          t: new Date().toLocaleTimeString(),
          btc: data.bitcoin.usd,
          eth: data.ethereum.usd
        };
        setPriceSeries((prev) => [...prev.slice(-29), point]); // keep last 30 points
      } catch (error) {
        console.error("Error fetching crypto prices:", error);
      }
    };

    fetchPrices(); // initial call
    const interval = setInterval(fetchPrices, 10000); // every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Crypto Trading — Price & Momentum</CardTitle>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-1 rounded-md bg-white/10 text-gray-300">BTC</span>
            <span className="px-2 py-1 rounded-md bg-white/10 text-gray-300">ETH</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={priceSeries}
              margin={{ left: 10, right: 10, top: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
              />
              <XAxis dataKey="t" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={["dataMin - 500", "dataMax + 500"]} />
              <Tooltip
                contentStyle={{
                  background: "#0b0b0b",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12
                }}
              />
              <Area
                type="monotone"
                dataKey="btc"
                stroke="#60a5fa"
                fill="url(#g1)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="eth"
                stroke="#fbbf24"
                fill="url(#g2)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};



interface Investment {
  amount: number;
  createdAt: string;
}

interface NavData {
  date: string;
  nav: number;
}


export function useGoldNavSeries(): NavData[] {
  const token = useAppSelector((state) => state.userState.user?.token);
  const [series, setSeries] = useState<NavData[]>([]);

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        const { data } = await axios.get<{ investments: Investment[] }>(
          `${productionUrl}/investment/my-investments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const formatted = data.investments.map((inv) => {
          const day = new Date(inv.createdAt).toLocaleDateString("en-US", {
            weekday: "short",
          });
          return { date: day, nav: inv.amount };
        });

        setSeries(formatted);
      } catch (error) {
        console.error("Error fetching investments:", error);
      }
    })();
  }, [token]);

  return series;
}







const GoldNavChart: React.FC = ({goldNavSeries}) => (
  <Card>
    <CardHeader>
      <CardTitle>Gold Investment — Portfolio NAV</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={goldNavSeries}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ background: "#0b0b0b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
            <Bar dataKey="nav" fill="#facc15" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);


interface TickerData {
  s: string; // symbol
  p: number; // price
  d: number; // daily change %
}

const TickerStrip: React.FC = () => {
  const [tickers, setTickers] = useState<TickerData[]>([]);

  const fetchData = async () => {
    try {
      const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];
      const responses = await Promise.all(
        symbols.map((symbol) =>
          fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`).then((res) => res.json())
        )
      );

      const data: TickerData[] = responses.map((item) => ({
        s: item.symbol.replace("USDT", ""),
        p: parseFloat(item.lastPrice),
        d: parseFloat(item.priceChangePercent),
      }));

      // Add Gold (static or from another API if needed)
      data.push({ s: "XAU", p: 2358, d: 0.3 });

      setTickers(data);
    } catch (error) {
      console.error("Error fetching Binance data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <motion.div
        className="flex gap-6 whitespace-nowrap text-sm text-gray-300"
        animate={{ x: [0, -300] }}
        transition={{ ease: "linear", duration: 18, repeat: Infinity }}
      >
        {tickers.map((t) => (
          <span
            key={t.s}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10"
          >
            <span className="font-semibold text-white mr-2">{t.s}</span>
            <span className="text-white">
              {t.p.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span
              className={`ml-2 ${t.d >= 0 ? "text-emerald-400" : "text-rose-400"}`}
            >
              {t.d >= 0 ? "+" : ""}
              {t.d.toFixed(2)}%
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

interface TransakOrder {
  id: string;
  status: string;
  fiatAmount: number;
  fiatCurrency: string;
  cryptoAmount: number;
  cryptoCurrency: string;
  walletAddress: string;
  createdAt: string;
}



// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------
const UserDashboard: React.FC = () => {
    const [orderBook, setOrderBook] = useState([]);
   const goldNavSeries = useGoldNavSeries();

  const user = useAppSelector((state) => state.userState.user);
  

  const navigate = useNavigate();
  
    useEffect(() => {
      if (!user) {
        navigate("/login");
      }
    }, [user, navigate]);
  
  




const [mode, setMode] = useState<"BUY" | "SELL" | null>(null);

  


  
    const token = useAppSelector((state) => state.userState.user?.token);
  const [cashBalance, setCashBalance] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)
  const [pctChange, setPctChange] = useState(0)

  

  const positions = {
    gold:[
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

  }

  const goldCount = positions.gold.length;
const cryptoCount = positions.crypto.length;
const hybridCount = positions.hybrid.length;

const totalCount = goldCount + cryptoCount + hybridCount;
  
  
    interface Holding {
  symbol: string; // e.g. BTC, ETH
  amount: number; // e.g. 0.5 BTC
  }

  
  const [holdings, setHoldings] = useState<Holding[]>([])


  interface Details {
    cryptoCurrency: string;
  }
  
  interface InnerHolding {
    details: Details;
    cryptoAmount: number;
  }

  
      const fetchHolding = async () => {
        try {
        const response = await axios.get<InnerHolding>(`${productionUrl}/cryptoOrders`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
        })
  
          
          // const mapHoldings = response.data.map((item:any) => {
          //       setHoldings([{
          //   symbol: item.details.cryptoCurrency,
          //   amount: item.cryptoAmount
          // }])
          // })

           const formatted = response.data
        .map((o: any) => ({
          amount: o.cryptoAmount,
         symbol: o.details.cryptoCurrency
        }))
          
          setHoldings(formatted)

       
        } catch (error) {
          console.log(error)
    }
      }
    
  useEffect(() => {
    fetchHolding()
  },[token])
 



const TotalEquityCard: React.FC = () => {
  const [totalEquity, setTotalEquity] = useState<number>(0);
  const [diff, setDiff] = useState<{ pct: number; dir: "up" | "down" }>({
    pct: 0,
    dir: "up",
  });

  // Store last equity in a ref (so it persists between renders without triggering updates)
  const lastEquityRef = useRef<number>(0);


 
  // Example holdings
 


  interface Balance {
    balance: number;
    totalProfit: number;
    pctChange: number;
  }


  const fetchCashBalance = async()=>{
    try {
        const balanceRes = await axios.get<Balance>(
          `${productionUrl}/auth/account/balance`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
   
      setCashBalance(balanceRes.data?.balance)
      setTotalProfit(balanceRes.data?.totalProfit)
      setPctChange(balanceRes.data?.pctChange)

    } catch (error) {
        console.error("❌ Failed to update account balance:", error);
    }
  }
  useEffect(() => {
    fetchCashBalance()
   },[token])
  



  const fetchEquity = async () => {

    try {
      const symbols = holdings.map((h) => `${h.symbol}USDT`);
      const responses = await Promise.all(
        symbols.map((symbol) =>
          fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`).then((res) => res.json())
        )
      );

      let equity = cashBalance;

      responses.forEach((item, idx) => {
      
        const price = parseFloat(item.lastPrice);
        equity += holdings[idx].amount * price;
      });

      // Calculate percentage change
      const prevEquity = lastEquityRef.current || equity;
      const changePct = ((equity - prevEquity) / prevEquity) * 100 

      setDiff({
        pct: parseFloat(changePct.toFixed(2)) || 0,
        dir: changePct >= 0 ? "up" : "down",
      });

      setTotalEquity(equity);
      lastEquityRef.current = equity; // store for next comparison
    } catch (error) {
      console.error("Error fetching equity:", error);
    }
  };

  useEffect(() => {
    fetchEquity();
    const interval = setInterval(fetchEquity, 15000); // every 15s
    return () => clearInterval(interval);
  }, []);

  return (
    <StatCard
      icon={<LineChartIcon />}
      label="Total Equity"
      value={`$${totalEquity.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`}
      diff={diff}
    />
  );
};

  









// ALL USERID ORDERS
useEffect(() => {
  async function fetchOrders() {
    try {
      // 1️⃣ Fetch from /orders
      const res = await fetch(`${productionUrl}/auth/orders`,{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` // adjust if token stored differently
          },
        
      });
      const data = await res.json();
    

      // 2️⃣ Format data for the order book display
      const formatted = data.data
        .map((o: any) => ({
          id: o.id,
          userId: o.userId, // keep userId
          amount: o.amountPaid,
          pair: `${o.cryptoCurrency}/${o.fiatCurrency}`,
          side: o.isBuyOrSell,
          type: o.paymentOption,
          price: o.conversionPrice,
          walletAddress: o.walletAddress,
          qty: o.cryptoAmount,
          filled: o.status === "COMPLETED" ? o.cryptoAmount : 0,
          status: o.status === "PENDING" ? "Open" : "Completed",
          createdAt: o.createdAt // keep in case you still want date sorting
        }))
        
    

      // 3️⃣ Post each fetched order to /cryptoOrders
      for (const o of data.data) {
        const postBody = {
          id: o.id,
          amountPaid: o.amountPaid,
          userId: o.userId,
           pair: `${o.cryptoCurrency}/${o.fiatCurrency}`,
          details: {
            cryptoCurrency: o.cryptoCurrency,
            fiatCurrency: o.fiatCurrency
          },
          type: o.paymentOption,
          isBuyOrSell: o.isBuyOrSell,
          paymentOption: o.paymentOption,
          conversionPrice: o.conversionPrice,
          cryptoAmount: o.cryptoAmount,
          walletAddress: o.walletAddress,
          status: o.status
        };

        await fetch(`${productionUrl}/cryptoOrders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` // adjust if token stored differently
          },
          body: JSON.stringify(postBody)
        });
      }



       // 1️⃣ Fetch from /orders
      const res2 = await fetch(`${productionUrl}/cryptoOrders`,{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` // adjust if token stored differently
          },
        
      });
     
      const data2 = await res2.json();
     

         const formatted2 = data2.map((o: any) => ({
          id: o.id,
          userId: o.userId, // keep userId
          amount: o.amountPaid,
          pair: o.pair,
          side: o.isBuyOrSell,
          type: o.type,
          price: o.conversionPrice,
          walletAddress: o.walletAddress,
          qty: o.cryptoAmount,
          filled: o.status === "COMPLETED" ? o.cryptoAmount : 0,
          status: o.status === "PENDING" ? "Open" : "Completed",
          createdAt: o.createdAt // keep in case you still want date sorting
        }))
        

      setOrderBook(formatted2);

    } catch (err) {
      console.error("Error fetching or posting orders:", err);
    }
  }

  fetchOrders();
}, []);
  
  
  
  const payouts = [
  { name: "John M.", amount: "$1,250", image: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Sarah K.", amount: "$980", image: "https://randomuser.me/api/portraits/women/45.jpg" },
  { name: "David P.", amount: "$2,340", image: "https://randomuser.me/api/portraits/men/21.jpg" },
  { name: "Emily R.", amount: "$1,780", image: "https://randomuser.me/api/portraits/women/68.jpg" },
  { name: "Michael T.", amount: "$3,100", image: "https://randomuser.me/api/portraits/men/77.jpg" },
];

 
  
    const [currentPayout, setCurrentPayout] = useState(payouts[0]);
  
    useEffect(() => {
      const interval = setInterval(() => {
        const random = payouts[Math.floor(Math.random() * payouts.length)];
        setCurrentPayout(random);
      }, 4000);
      return () => clearInterval(interval);
    }, []);

  

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100">
       {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-black/30 border-b border-white/10">
     <div className="max-w-5xl mx-auto">
         <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 grid grid-cols-1 gap-4 lg:flex  items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-400 text-black font-extrabold grid place-items-center">BG</div>
            <div>
              <div className="text-white font-semibold">Barick Gold</div>
              <div className="text-xs text-gray-400">Crypto Trading • Brokerage • Gold Portfolios • Insights</div>
            </div>
          </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/viewPortfolio" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm">Gold Investment Portfolio</Link>
              <Link to="/depositFundsForm" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm">Invest</Link>
            <Link to="/depositFunds" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm">Deposit</Link>
            <Link to="/withdrawFunds" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm">Withdraw</Link>
              <Link to="/transactions" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm">Statement</Link>
                <Link to="/settings" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm">Settings</Link>
            <div className="w-8 h-8 rounded-full bg-white/10" />
          </div>
        </div>
     </div>
      </header>

      {/* Ticker */}
      <div className="px-4 md:px-6 py-3">
      <div className="max-w-5xl mx-auto">
          <TickerStrip />
      </div>
      </div>


            <div className="max-w-5xl mx-auto">
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 pb-24">
        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-4">
          <TotalEquityCard />
          <StatCard icon={<CandlestickChart />} label="24h P&L" value={formatter.format(totalProfit)} diff={{ pct: Number(pctChange), dir: "up" }} />
          <StatCard icon={<Wallet />} label="Available Balance" value={formatter.format(cashBalance) || 0}/>
          <StatCard icon={<BriefcaseBusiness />} label="Positions" value={totalCount} />
        </section>

        {/* Charts & Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mt-6">
          <div className="lg:col-span-2 grid grid-cols-1 gap-4">
            <CryptoAnalysisChart />
              <OrdersTable orderBook={orderBook} />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <BrokerageActions cashBalance={cashBalance} Swal={Swal}/>
            <GoldNavChart goldNavSeries={goldNavSeries}/>
            <PortfolioCard />
          </div>
        </section>

        {/* Insights */}
        <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <InsightsFeed />
         <CryptoMomentumCard />
          </section>
          


          {/* Fake Live Payout Alert */}
      <div className="fixed bottom-5 left-5 bg-gray-800 p-3 rounded-xl shadow-lg flex items-center gap-3 border border-yellow-500 animate-bounce z-50">
        <img
          src={currentPayout.image}
          alt={currentPayout.name}
          className="w-10 h-10 rounded-full border-2 border-yellow-500"
        />
        <div>
          <p className="text-sm font-semibold">{currentPayout.name}</p>
          <p className="text-xs text-gray-300">
            Just received <span className="text-yellow-400 font-bold">{currentPayout.amount}</span>
          </p>
        </div>
      </div>
        </main>
        
        

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Barick Gold.
      </footer>
            </div>
     
    </div>
  );
};

export default UserDashboard;
