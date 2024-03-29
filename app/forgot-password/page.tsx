"use client";
import Navbar from "@/components/navbar/Navbar";
import { auth } from "@/firebase/firebase.config";
import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";

interface ForgotPasswordProps {}

const ForgotPassword: React.FC<ForgotPasswordProps> = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Clear any previous errors

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent successfully!");
    } catch (err: any) {
      setError(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center w-full min-h-svh bg-gray-100">
        <div className="w-[90%] md:w-[50%] 2xl:w-[30%] mx-auto my-auto text-center bg-gray-200 p-10 rounded-lg mt-[5rem]">
          <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-2 text-start"
          >
            {/* <label htmlFor="email" className="text-base font-medium">
              Email:
            </label> */}
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="rounded-md px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Send Reset Link
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
