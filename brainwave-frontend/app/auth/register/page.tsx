"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "../../components/Input";
import Button from "../../components/Button";

const users = [
  { name: "Hamza Khurshid", email: "hamza@gmail.com", password: "new123" },
  { name: "John Doe", email: "john@example.com", password: "password123" },
];

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const userExists = users.some((user) => user.email === email);
    if (userExists) {
      alert("User already exists. Please login.");
      return;
    }

    users.push({ name, email, password });
    alert("Registration successful! Redirecting to dashboard...");
    router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" />
          <Input label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" />
          <div className="text-sm text-center">
            <span className="text-black">Already have an account?</span> <Link href="/login" className="text-blue-500 hover:underline">Login here</Link>
          </div>
          <Button type="submit" fullWidth>Register</Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
