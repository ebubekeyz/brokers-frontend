import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TickerData {
  s: string; // symbol
  p: number; // price
  d: number; // daily change %
}

const TickerStrip: React.FC = () => {
  const [tickers, setTickers] = useState<TickerData[]>([]);

  const fetchData = async () => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true"
      );
      const cryptoData = await res.json();

      // For gold price (XAU) - using a free API endpoint
      const goldRes = await fetch(
        "https://api.metals.live/v1/spot" // returns array with gold price first
      );
      const metalsData = await goldRes.json();
      const goldPrice = metalsData[0].gold;

      setTickers([
        {
          s: "BTC",
          p: cryptoData.bitcoin.usd,
          d: cryptoData.bitcoin.usd_24h_change
        },
        {
          s: "ETH",
          p: cryptoData.ethereum.usd,
          d: cryptoData.ethereum.usd_24h_change
        },
        {
          s: "SOL",
          p: cryptoData.solana.usd,
          d: cryptoData.solana.usd_24h_change
        },
        {
          s: "XAU",
          p: goldPrice,
          d: 0.3 // placeholder, metals.live free tier doesn’t return daily change
        }
      ]);
    } catch (error) {
      console.error("Error fetching ticker data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // update every 15s
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
                maximumFractionDigits: 2
              })}
            </span>
            <span
              className={`ml-2 ${
                t.d >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
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

export default TickerStrip;
