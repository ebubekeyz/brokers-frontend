import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { useEffect } from "react";



const BondsPage: React.FC = () => {
   const user = useAppSelector((state) => state.userState.user);
      const navigate = useNavigate();
    
      useEffect(() => {
        if (!user) {
          navigate('/login');
        }
      }, [user, navigate]);
  
  const bonds = [
    { name: 'U.S. Treasury Bond 10Y', type: 'Government', interestRate: '4.25%', maturity: '2034' },
    { name: 'Corporate Bond - Tesla', type: 'Corporate', interestRate: '3.50%', maturity: '2030' },
    { name: 'Municipal Bond - California', type: 'Municipal', interestRate: '2.85%', maturity: '2029' },
    { name: 'U.S. Treasury Bond 30Y', type: 'Government', interestRate: '4.75%', maturity: '2055' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">Bond Investments</h1>
      <p className="text-gray-700 mb-4">
        Invest in a range of reliable bonds that suit your long-term and low-risk investment goals.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bonds.map((bond, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded shadow-md hover:shadow-lg transition border-l-4 border-indigo-500"
          >
            <h3 className="text-xl font-semibold text-gray-800">{bond.name}</h3>
            <p className="text-sm text-gray-700">Type: {bond.type}</p>
            <p className="text-sm text-gray-600">Interest Rate: {bond.interestRate}</p>
            <p className="text-sm text-gray-600">Maturity: {bond.maturity}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BondsPage;