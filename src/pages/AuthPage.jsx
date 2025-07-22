import { useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { login } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

const AuthPage = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors] = useState({});
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [showPassword, setShowPassword] = useState({ password: false });

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!validateForm()) return;

    setLoadingLogin(true);
    try {
      const res = await login({ email, password });
      authLogin(res?.data);
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      setErrorMsg("Email or Password Incorrect");
    } finally {
      setLoadingLogin(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4 w-full">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-300 hover:scale-105">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Inventory Management System
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Sign in to manage your inventory efficiently
          </p>
        </div>

        {errorMsg && (
          <Alert
            variant="destructive"
            className="mb-6 bg-red-50 border-red-200"
          >
            <AlertDescription className="text-red-600">
              {errorMsg}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Icon icon="mdi:email" className="text-xl" />
            </div>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Icon icon="ri:lock-password-fill" className="text-xl" />
            </div>
            <input
              id="password"
              type={showPassword.password ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Icon
                onClick={() => togglePasswordVisibility("password")}
                icon={
                  showPassword.password ? "eva:eye-fill" : "eva:eye-off-fill"
                }
                className="text-xl cursor-pointer hover:text-blue-500 transition duration-200"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loadingLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition duration-300 flex items-center justify-center"
          >
            {loadingLogin ? (
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                />
              </svg>
            ) : null}
            {loadingLogin ? "Signing In..." : "Sign In"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            <a
              href="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Forgot your password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
