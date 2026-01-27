const CryptoInvestPage: React.FC = () => {
  const cryptoAssets = [
    {
      name: 'Bitcoin (BTC)',
      category: 'Store of Value',
      price: '$64,300',
      risk: 'High',
      status: 'Open for Investment',
    },
    {
      name: 'Ethereum (ETH)',
      category: 'Smart Contracts',
      price: '$3,400',
      risk: 'Medium-High',
      status: 'Open for Investment',
    },
    {
      name: 'Solana (SOL)',
      category: 'DeFi / NFTs',
      price: '$115.60',
      risk: 'Medium',
      status: 'Open for Investment',
    },
    {
      name: 'USDC Stablecoin',
      category: 'Stable Asset',
      price: '$1.00',
      risk: 'Low',
      status: 'Stable - Limited Growth',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-purple-700 mb-6">Crypto Investment Opportunities</h1>
      <p className="text-gray-700 mb-4">
        Explore popular cryptocurrency assets and diversify your investment portfolio with high-potential digital currencies.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cryptoAssets.map((crypto, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded shadow-md hover:shadow-lg transition border-l-4 border-purple-500"
          >
            <h3 className="text-xl font-semibold text-gray-800">{crypto.name}</h3>
            <p className="text-sm text-gray-700">Category: {crypto.category}</p>
            <p className="text-sm text-gray-600">Price: {crypto.price}</p>
            <p className="text-sm text-gray-600">Risk Level: {crypto.risk}</p>
            <p className="text-sm font-semibold mt-2 text-green-600">{crypto.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoInvestPage;