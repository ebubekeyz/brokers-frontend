import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, LoaderCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const DeleteSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const approveReceipt = async () => {
      try {
        const response = await axios.get(
          `https://brokers-backend-h2nt.onrender.com/api/upload-receipt/delete/${id}`
        );
        console.log('Delete response:', response.data);
        setSuccess(true);
      } catch (err: any) {
        console.error('Delete failed:', err);
        setError('Delete failed. Please try again or contact support.');
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
            <h1 className="text-xl font-semibold mt-4 text-gray-700">Deleting...</h1>
          </>
        ) : error ? (
          <>
            <XCircle className="mx-auto text-red-500" size={64} />
            <h1 className="text-xl font-semibold mt-4 text-red-700">Delete Failed</h1>
            <p className="text-gray-600 mt-2">{error}</p>
          </>
        ) : (
          <>
            <CheckCircle className="mx-auto text-green-500" size={64} />
            <h1 className="text-2xl font-bold mt-4 text-gray-800">Delete Successful!</h1>
            <p className="text-gray-600 mt-2">
              Transaction has been Deleted successfully.
            </p>
          </>
        )}

        <button
          onClick={() => navigate('/adminDashboard')}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl transition duration-300"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default DeleteSuccess;
