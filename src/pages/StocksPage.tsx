import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { useEffect } from "react";

const StocksPage: React.FC = () => {
   const user = useAppSelector((state) => state.userState.user);
      const navigate = useNavigate();
    
      useEffect(() => {
        if (!user) {
          navigate('/login');
        }
      }, [user, navigate]);
  const stocks = [
    { name: 'Apple Inc.', symbol: 'AAPL', exchange: 'NASDAQ', sector: 'Technology' },
    { name: 'Tesla Inc.', symbol: 'TSLA', exchange: 'NASDAQ', sector: 'Automotive' },
    { name: 'Amazon.com Inc.', symbol: 'AMZN', exchange: 'NASDAQ', sector: 'E-commerce' },
    { name: 'Microsoft Corp.', symbol: 'MSFT', exchange: 'NASDAQ', sector: 'Technology' },
    { name: 'Meta Platforms Inc.', symbol: 'META', exchange: 'NASDAQ', sector: 'Social Media' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Stocks Investment</h1>
      <p className="text-gray-700 mb-4">
        Explore our selection of top-performing stocks available for investment. Our platform provides access to reliable market opportunities.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stocks.map((stock, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded shadow-md hover:shadow-lg transition border-l-4 border-green-500"
          >
            <h3 className="text-xl font-semibold text-gray-800">{stock.name} ({stock.symbol})</h3>
            <p className="text-sm text-gray-700">Exchange: {stock.exchange}</p>
            <p className="text-sm text-gray-600">Sector: {stock.sector}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StocksPage;
