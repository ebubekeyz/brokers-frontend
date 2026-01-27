import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { useEffect } from "react";

const RealEstatePage: React.FC = () => {
   const user = useAppSelector((state) => state.userState.user);
      const navigate = useNavigate();
    
      useEffect(() => {
        if (!user) {
          navigate('/login');
        }
      }, [user, navigate]);
  
  
  const properties = [
    {
      title: 'Downtown Office Complex',
      type: 'Commercial',
      location: 'New York, NY',
      returnRate: '6.5%',
      status: 'Available',
    },
    {
      title: 'Luxury Beachfront Villas',
      type: 'Residential',
      location: 'Miami, FL',
      returnRate: '8.2%',
      status: 'Available',
    },
    {
      title: 'Tech Park Development',
      type: 'Commercial',
      location: 'San Jose, CA',
      returnRate: '7.8%',
      status: 'Coming Soon',
    },
    {
      title: 'Suburban Housing Estate',
      type: 'Residential',
      location: 'Austin, TX',
      returnRate: '5.9%',
      status: 'Sold Out',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-orange-700 mb-6">Real Estate Investment</h1>
      <p className="text-gray-700 mb-4">
        Discover high-potential real estate properties across commercial and residential sectors. Earn stable returns through strategic real estate investments.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded shadow-md hover:shadow-lg transition border-l-4 border-orange-500"
          >
            <h3 className="text-xl font-semibold text-gray-800">{property.title}</h3>
            <p className="text-sm text-gray-700">Type: {property.type}</p>
            <p className="text-sm text-gray-600">Location: {property.location}</p>
            <p className="text-sm text-gray-600">Expected Return: {property.returnRate}</p>
            <p className={`text-sm font-semibold mt-2 ${property.status === 'Available' ? 'text-green-600' : property.status === 'Sold Out' ? 'text-red-500' : 'text-yellow-600'}`}>
              Status: {property.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealEstatePage;