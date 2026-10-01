import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../components/loader";
import PasswordInput from "../components/PasswordInput";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  async function register() {
      if (firstName.trim() === "") {
        toast.error("First name is required");
        return;
      }
      if (lastName.trim() === "") {
        toast.error("Last name is required");
        return;
      }
      if (email.trim() === "") {
        toast.error("Email is required");
        return;
      }
      if (password.trim() === "") {
        toast.error("Password is required");
        return;
      }
      if (password.length < 12) {
        toast.error("Use a password with at least 12 characters");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      setIsLoading(true);

      try{
        await axios.post(import.meta.env.VITE_BACKEND_URL + "/users",{
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email : email.trim(),
          password : password,
        });

        navigate("/login");
        toast.success("Registration successful!");

      } catch(err){
        toast.error(err.response?.data?.message || "Registration failed. Please try again.");
        console.log(err);
      } finally {
        setIsLoading(false);
      }
  }

  return (
    <div className="bg-white min-h-screen w-full flex items-stretch justify-center">
      
      <div className="flex flex-col md:flex-row w-full min-h-screen bg-white overflow-hidden">

        {/* Left Side */}
        <div className="relative flex min-h-32 w-full shrink-0 flex-col justify-between overflow-hidden p-5 text-white md:min-h-screen md:w-1/2 md:p-12">
          <img src="https://wlbbtprbqprjphegkdtq.supabase.co/storage/v1/object/public/Images/sing%20up.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-slate-950/35" />
          
          <div className="relative z-10 text-2xl font-black tracking-wide">
            <span className="text-brand">Scholarly</span>
          </div>

          <div className="relative z-10 mt-8 md:mt-0 max-md:hidden">
            <h1 className="text-5xl font-extrabold mb-6 leading-tight">
              Master your <br/>digital craft.
            </h1>
            <p className="text-accent-100 text-lg pr-8">
              Join a community of artisans and thinkers in a space designed for deep, uninterrupted learning.
            </p>
          </div>

          <div className="relative z-10 mt-6 w-fit rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm max-md:hidden">
            <p className="font-bold text-sm">4.9/5 from 2,000+ Students</p>
            <p className="text-xs text-accent-100 mt-1">
              Highly rated for curriculum depth.
            </p>
          </div>

        </div>

        {/* Right Side */}
        <div className="flex w-full flex-1 items-center justify-center bg-white px-5 py-8 md:min-h-screen md:w-1/2 md:p-10">

          <div className="w-full max-w-sm">

             {/* Toggle Login/SignUp */}
             <div className="flex justify-center mb-8">
              <div className="bg-gray-100 rounded-full p-1 flex w-56">
                <Link to="/login" className="w-1/2 text-center py-2 rounded-full text-sm font-bold text-gray-500 hover:text-gray-700 transition">
                  Login
                </Link>
                <Link to="/register" className="w-1/2 text-center py-2 rounded-full bg-white shadow-sm text-sm font-bold text-accent">
                  Sign Up
                </Link>
              </div>
            </div>

            {/* Header */}
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-center text-gray-500 mb-6 text-sm">
              Join thousands of learners today.
            </p>

            {/* Full Name (First & Last side by side) */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Full Name</label>
              <div className="flex gap-3">
                <input
                  onChange={(e) => setFirstName(e.target.value)}
                  type="text"
                  placeholder="First Name"
                  className="w-1/2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition text-sm"
                />
                <input
                  onChange={(e) => setLastName(e.target.value)}
                  type="text"
                  placeholder="Last Name"
                  className="w-1/2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Email Address</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="name@company.com"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition text-sm"
              />
            </div>

            {/* Password & Confirm Side by Side */}
            <div className="mb-6 flex gap-3">
              <div className="w-1/2">
                <label htmlFor="register-password" className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Password</label>
                <PasswordInput
                  id="register-password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="register-confirm-password" className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Confirm</label>
                <PasswordInput
                  id="register-confirm-password"
                  label="confirm password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Button */}
            <button className="w-full bg-accent text-white py-3.5 rounded-xl font-bold hover:bg-accent transition shadow-lg shadow-accent/30 cursor-pointer"
              onClick={register}
              disabled={isLoading}
              >
              {isLoading ? "Loading..." : "Create Account"}
            </button>

            {/* Footer */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-accent font-bold hover:underline cursor-pointer">
                Sign In
              </Link>
            </p>
          </div>

        </div>

      </div>
      {isLoading && <Loader />}
    </div>
  );
}
