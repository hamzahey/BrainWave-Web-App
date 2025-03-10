"use client";

import { useState } from "react";
import Link from "next/link";
import Input from "../../components/Input";
import Button from "../../components/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          
          {/* Password Field */}
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />

          <div className="flex justify-between text-sm">
            <Link href="" className="text-blue-500 hover:underline">
              Forgot password?
            </Link>
            <Link href="" className="text-blue-500 hover:underline">
              Create an account
            </Link>
          </div>

          {/* Submit Button */}
          <Button type="submit" fullWidth>
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
