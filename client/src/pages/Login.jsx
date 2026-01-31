import React, { useState } from "react";
import { userApi } from "../api";
import { useAuth } from "../context/AuthContext";

const Login = ({ setShowLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { fetchUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (isSignup && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      if (isSignup) {
        await userApi.register({ name, email, password });
      } else {
        await userApi.login({ email, password });
      }
      await fetchUser();
      setShowLogin(false);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    console.log(isSignup ? "Google Signup" : "Google Login");
    // later → window.location.href = BACKEND_GOOGLE_AUTH_URL
  };

  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-[800px] h-[480px] bg-white rounded-xl overflow-hidden"
      >
        {/* Left Image */}
        <div className="w-1/2 hidden md:block">
          <img
            className="h-full w-full object-cover"
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png"
            alt=""
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-8">
          <form onSubmit={handleSubmit} className="w-full max-w-sm">
            <h2 className="text-2xl font-semibold text-gray-900">
              {isSignup ? "Create Account" : "Sign in"}
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              {isSignup
                ? "Create a new account to get started"
                : "Welcome back! Please sign in"}
            </p>

            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full mt-4 bg-gray-100 h-9 rounded-full flex items-center justify-center gap-2 hover:bg-gray-200 transition"
            >
              <img
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
                alt="google"
                className="h-4"
              />
              <span className="text-sm text-gray-700">
                {isSignup ? "Sign up with Google" : "Continue with Google"}
              </span>
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-xs text-gray-400">
                or continue with email
              </span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {error && (
              <p className="text-sm text-red-600 mb-2">{error}</p>
            )}

            {isSignup && (
              <input
                type="text"
                placeholder="Full Name"
                className="w-full h-9 border rounded-full px-4 text-sm mb-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <input
              type="email"
              placeholder="Email"
              className="w-full h-9 border rounded-full px-4 text-sm mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full h-9 border rounded-full px-4 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {isSignup && (
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full h-9 border rounded-full px-4 text-sm mt-3"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            )}

            {!isSignup && (
              <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  Remember me
                </label>
                <span className="underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 h-9 rounded-full bg-indigo-500 text-white text-sm disabled:opacity-50"
            >
              {loading ? "Please wait..." : isSignup ? "Sign up" : "Login"}
            </button>

            {/* Toggle */}
            <p className="text-xs text-gray-500 mt-3 text-center">
              {isSignup
                ? "Already have an account?"
                : "Don’t have an account?"}
              <span
                onClick={() => setIsSignup(!isSignup)}
                className="text-indigo-500 cursor-pointer ml-1"
              >
                {isSignup ? "Login" : "Sign up"}
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
