import React, { useEffect, useState, useRef } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PricePoint {
  t: string;
  btc: number;
  eth: number;
}

const CryptoMomentum: React.FC = () => {
  const [priceSeries, setPriceSeries] = useState<PricePoint[]>([]);
  const btcRef = useRef<number | null>(null);
  const ethRef = useRef<number | null>(null);

  useEffect(() => {
    const wsBtc = new WebSocket(
      "wss://stream.binance.com:9443/ws/btcusdt@trade"
    );
    const wsEth = new WebSocket(
      "wss://stream.binance.com:9443/ws/ethusdt@trade"
    );

    wsBtc.onmessage = (event) => {
      const trade = JSON.parse(event.data);
      btcRef.current = parseFloat(trade.p);
      updateData();
    };

    wsEth.onmessage = (event) => {
      const trade = JSON.parse(event.data);
      ethRef.current = parseFloat(trade.p);
      updateData();
    };

    const updateData = () => {
      if (btcRef.current && ethRef.current) {
        const time = new Date().toLocaleTimeString();
        setPriceSeries((prev) =>
          [...prev, { t: time, btc: btcRef.current!, eth: ethRef.current! }].slice(-30)
        );
      }
    };

    return () => {
      wsBtc.close();
      wsEth.close();
    };
  }, []);

  return (
    <Card className="col-span-2 bg-gray-900 border-gray-800 text-white">
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
              <YAxis
                stroke="#9ca3af"
                domain={["dataMin - 50", "dataMax + 50"]}
              />
              <Tooltip
                contentStyle={{
                  background: "#0b0b0b",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
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

export default CryptoMomentum;
