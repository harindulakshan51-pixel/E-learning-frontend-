import { useState } from "react";
import toast from "react-hot-toast";
import Loader from "../components/loader";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function ForgetPasswordPage() {
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  async function resetPassword() {
    if (newPassword !== confirmPassword) {
      toast.error("passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await axios.post(import.meta.env.VITE_BACKEND_URL + "/users/validate-otp", {
        email: email,
        otp: otp,
        newPassword: newPassword,
      });
      toast.success("Password reset successful");
      setLoading(false);
      navigate("/login");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Error resetting password. Try again later.");
      setLoading(false);
    }
  }

  async function sendOtp() {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      await axios.get(import.meta.env.VITE_BACKEND_URL + "/users/send-otp/" + email);
      toast.success("OTP sent to your email");
      setLoading(false);
      setOtpSent(true);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Error sending OTP. Try again later");
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen py-10 px-4 flex flex-col justify-center items-center bg-gray-50">
      {loading && <Loader />}

      {otpSent ? (
        <div className="w-full max-w-[420px] h-auto flex flex-col justify-center items-center bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-2 text-center text-gray-900">Enter OTP & New Password</h2>
          <p className="text-gray-500 text-xs sm:text-sm text-center mb-6">Enter the verification code sent to your email.</p>
          
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full p-3 mb-4 border border-gray-200 rounded-xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm bg-gray-50"
            value={otp} 
            onChange={(e) => setOtp(e.target.value)}
            autoComplete="off" 
          />

          <input
            type="password"
            placeholder="Enter New Password"
            className="w-full p-3 mb-4 border border-gray-200 rounded-xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm bg-gray-50"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full p-3 mb-6 border border-gray-200 rounded-xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm bg-gray-50"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            onClick={resetPassword}
            className="w-full bg-accent text-white py-3.5 rounded-xl font-bold hover:bg-accent transition-all shadow-md active:scale-95 cursor-pointer text-sm"
          >
            Reset Password
          </button>

          <Link to="/login" className="mt-5 text-sm font-semibold text-gray-500 hover:text-accent transition-colors">
            ← Back to Login
          </Link>
        </div>
      ) : (
        <div className="w-full max-w-[420px] min-h-[360px] flex flex-col justify-center items-center bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
          <div className="w-12 h-12 bg-accent-50 rounded-2xl flex items-center justify-center text-accent text-2xl mb-4">
            🔑
          </div>
          <h2 className="text-2xl font-bold mb-2 text-center text-gray-900">Reset Your Password</h2>
          <p className="text-gray-500 text-xs sm:text-sm text-center mb-6">Enter your registered email to receive an OTP.</p>

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 mb-6 border border-gray-200 rounded-xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm bg-gray-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={sendOtp}
            className="w-full bg-accent text-white py-3.5 rounded-xl font-bold hover:bg-accent transition-all shadow-md active:scale-95 cursor-pointer text-sm"
          >
            Send OTP
          </button>

          <Link to="/login" className="mt-6 text-sm font-semibold text-gray-500 hover:text-accent transition-colors">
            ← Back to Login
          </Link>
        </div>
      )}
    </div>
  );
}