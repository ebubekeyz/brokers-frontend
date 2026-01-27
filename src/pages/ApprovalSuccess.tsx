import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, LoaderCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const ApprovalSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

    console.log(id)

  useEffect(() => {
    const approveReceipt = async () => {
      try {
        const response = await axios.get(
          `https://brokers-backend-hbq6.onrender.com/api/upload-receipt/approve/${id}`
        );
        console.log('Approval response:', response.data);
        setSuccess(true);
      } catch (err: any) {
        console.error('Approval failed:', err);
        setError('Approval failed. Please try again or contact support.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      approveReceipt();
    }
  }, [id]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        {loading ? (
          <>
            <LoaderCircle className="mx-auto animate-spin text-blue-500" size={64} />
            <h1 className="text-xl font-semibold mt-4 text-gray-700">Approving...</h1>
          </>
        ) : error ? (
          <>
            <XCircle className="mx-auto text-red-500" size={64} />
            <h1 className="text-xl font-semibold mt-4 text-red-700">Approval Failed</h1>
            <p className="text-gray-600 mt-2">{error}</p>
          </>
        ) : (
          <>
            <CheckCircle className="mx-auto text-green-500" size={64} />
            <h1 className="text-2xl font-bold mt-4 text-gray-800">Approval Successful!</h1>
            <p className="text-gray-600 mt-2">
              Transaction has been approved successfully.
            </p>
          </>
        )}

        <button
          onClick={() => navigate('/adminDashboard/userPage')}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl transition duration-300"
        >
          Back to All Users to Update Balance
        </button>
      </div>
    </div>
  );
};

export default ApprovalSuccess;
