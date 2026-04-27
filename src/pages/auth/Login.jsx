import React, { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { useNavigate, Link } from 'react-router-dom';
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import api from "../../utils/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  //handle login form submit
 const handleLogin = async (e) => {
  e.preventDefault();
  if (!validateEmail(email)) return setError("Please enter a valid email.");
  if (!password) return setError("Password is required.");

  try {
    const res = await api.post("/auth/login", { email, password });
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Something went wrong. Try again.");
  }
};

  return (
    <AuthLayout>
      <div className="w-full">
        <h3 className="text-2xl font-semibold text-white tracking-tight">Welcome Back</h3>
        <p className="text-sm text-zinc-400 mt-2 mb-8">
          Please enter your details to log in
        </p>

        <form onSubmit={handleLogin} className="space-y-2">
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="somethingrandom@gmail.com"
            type="text"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Minimum 8 Characters"
            type="password"
          />

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="pt-4">
            <button type="submit" className="btn-primary py-3.5">
              Login
            </button>
          </div>

          <p className="text-sm text-zinc-400 mt-6 text-center">
            Don't have an account?{" "}
            <Link className="font-medium text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition-colors" to="/signup">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
