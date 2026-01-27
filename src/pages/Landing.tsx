// src/pages/LandingPage.tsx
import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import { motion } from "framer-motion";

const slides = [
  {
    id: "1",
    image: "/images/crypto-image.webp",
    title: "Invest in Crypto with Confidence",
    description:
      "Grow your wealth with secure and fast cryptocurrency investments tailored for the modern investor.",
    ctaLabel: "Start Investing",
    ctaHref: "/login",
  },
  {
    id: "2",
    image: "/images/gold-image.jpg",
    title: "Build Stability with Gold",
    description:
      "Protect your portfolio with gold — the timeless asset that has held value for centuries.",
    ctaLabel: "Learn More",
    ctaHref: "/about",
  },
];

const payouts = [
  { name: "John M.", amount: "$1,250", image: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Sarah K.", amount: "$980", image: "https://randomuser.me/api/portraits/women/45.jpg" },
  { name: "David P.", amount: "$2,340", image: "https://randomuser.me/api/portraits/men/21.jpg" },
  { name: "Emily R.", amount: "$1,780", image: "https://randomuser.me/api/portraits/women/68.jpg" },
  { name: "Michael T.", amount: "$3,100", image: "https://randomuser.me/api/portraits/men/77.jpg" },
];

const testimonials = [
  {
    name: "Alice W.",
    feedback:
      "GoldCrypto Invest has completely transformed my portfolio. I’ve seen steady growth and the platform is incredibly easy to use.",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    name: "James L.",
    feedback:
      "The combination of crypto and gold investments is genius. I feel secure yet still get high returns.",
    image: "https://randomuser.me/api/portraits/men/44.jpg",
  },
  {
    name: "Sophia B.",
    feedback:
      "I was new to investing, but the guidance and support here made me confident. Highly recommended!",
    image: "https://randomuser.me/api/portraits/women/19.jpg",
  },
];

const partners = [
  { name: "Binance", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/Binance_logo.svg" },
  { name: "Coinbase", logo: "https://cdn.worldvectorlogo.com/logos/coinbase.svg" },
  { name: "Tether", logo: "https://www.svgrepo.com/show/367256/usdt.svg" },
  { name: "Paxos", logo: "https://static.cdnlogo.com/logos/p/32/paxos-standard.svg" }
];

const LandingPage: React.FC = () => {
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








  const [currentPayout, setCurrentPayout] = useState(payouts[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const random = payouts[Math.floor(Math.random() * payouts.length)];
      setCurrentPayout(random);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-900 text-white">
      <TickerStrip />
      {/* Hero Slider */}
      <Hero slides={slides} autoplay={true} delay={5000} />
      

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

      {/* About Section */}
      <section id="about" className="max-w-6xl mx-auto px-6 py-16 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          About Our Investment Platform
        </h2>
        <p className="text-gray-300 text-lg mb-4">
          We combine the high-growth potential of cryptocurrencies with the
          long-term stability of gold to create a balanced investment strategy.
          Our platform offers secure, transparent, and easy-to-use investment
          tools to help you grow your wealth.
        </p>
        <p className="text-gray-400">
          Whether you are new to investing or an experienced trader, our system
          is designed to guide you every step of the way.
        </p>
      </section>

      {/* Features Section */}
      <section className="bg-gray-800 py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
          <div className="bg-gray-700 p-8 rounded-2xl shadow-lg">
            <img src="/images/crypto-icon.svg" alt="Crypto Icon" className="w-16 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Crypto Investments</h3>
            <p className="text-gray-300">
              Benefit from the high returns of Bitcoin, Ethereum, and other top
              cryptocurrencies. We use advanced analytics and AI-driven
              insights to maximize your profits.
            </p>
          </div>

          <div className="bg-gray-700 p-8 rounded-2xl shadow-lg">
            <img src="/images/gold-icon.svg" alt="Gold Icon" className="w-16 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Gold Investments</h3>
            <p className="text-gray-300">
              Preserve your capital and hedge against inflation by investing in
              physical and digital gold, all managed through our secure
              platform.
            </p>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="bg-gray-900 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-yellow-400">Our Trusted Partners</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {partners.map((partner, idx) => (
              <div key={idx} className="bg-gray-800 p-4 rounded-xl shadow-md hover:scale-105 transition-transform duration-300">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-12 w-auto mx-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-10">What Our Investors Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-16 h-16 mx-auto rounded-full border-2 border-yellow-500 mb-4"
                />
                <p className="text-gray-300 italic mb-4">"{t.feedback}"</p>
                <h4 className="text-yellow-400 font-semibold">{t.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="get-started" className="py-16 bg-yellow-500 text-black text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Start Your Investment Journey Today
        </h2>
        <p className="mb-6">
          Sign up now to access our investment tools and grow your portfolio.
        </p>
        <a
          href="/register"
          className="inline-block px-8 py-4 bg-black text-yellow-500 rounded-lg font-semibold hover:bg-gray-900"
        >
          Get Started
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-8 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} GoldCrypto Invest. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
