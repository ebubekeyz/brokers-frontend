import React, { useState } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../features/user/UserSlice";

const productionUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:7000/api"
    : "https://brokers-backend-h2nt.onrender.com/api";

const API_URL = `${productionUrl}/auth/login`;

const Login: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.userState.user);

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(API_URL, { email, password });
      setMessage(res.data.msg || "OTP sent to your email.");
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(API_URL, { email, otpCode });
      const { token, user } = res.data;

      dispatch(loginUser({ user, token }));
      localStorage.setItem("token", token);
      setMessage(`Welcome, ${user.fullName}!`);

      if (user.role !== "user") {
        window.location.href = "/adminDashboard";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setError(err.response?.data?.msg || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-900 via-gray-900 to-black">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md border border-yellow-500 mx-4">
        <Link to="/" className="text-2xl font-bold text-center text-yellow-400 mb-6 grid justify-center">
          <img
            src="/brokers-logo.png"
            alt="Barick Gold Logo"
            className="w-28 object-contain"
          />
        </Link>

        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {message && <p className="text-green-400 text-sm">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Login"}
            </button>

            {/* Register Link */}
            <p className="text-gray-400 text-sm text-center mt-4">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-yellow-400 hover:underline font-medium"
              >
                Register here
              </Link>
            </p>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-4">
            <p className="text-gray-300 text-sm text-center">
              Enter the OTP sent to your email.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                OTP Code
              </label>
              <input
                type="text"
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {message && <p className="text-green-400 text-sm">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* Register Link */}
            <p className="text-gray-400 text-sm text-center mt-4">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-yellow-400 hover:underline font-medium"
              >
                Register here
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
