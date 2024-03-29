"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase.config";
import Navbar from "@/components/navbar/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      if (password !== confirmPassword) {
        toast({
          title: "Passwords do not match",
          description: "Please make sure the passwords match.",
          variant: "destructive"
        });
        return;
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        console.log(user);
        toast({
          title: "Account created.",
          description: "You have successfully created an account.",
          variant: "default"
        });
        setEmail("");
        setPassword("");

        router.push("/");
      }
    } catch (error) {
      // check if there is a existing account using firebase v9
      if ((error as any).code === "auth/email-already-in-use") {
        toast({
          title: "Email already in use",
          description:
            "The email address is already in use by another account.",
          variant: "destructive"
        });
      } else if ((error as any).code === "auth/weak-password") {
        toast({
          title: "Weak Password",
          description: "The password must be 6 characters long or more.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error creating account",
          description: `${(error as any).message}`,
          variant: "destructive"
        });
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center w-full min-h-svh bg-gray-100">
        <div className="w-[90%] md:w-[50%] 2xl:w-[30%] mx-auto my-auto text-center bg-gray-200 p-10 rounded-lg mt-[5rem]">
          <Image
            src={"/images/logo.png"}
            alt="Sign In"
            className="mx-auto rounded-full mb-2"
            width={200}
            height={200}
          />
          <h1 className="text-3xl font-bold mb-4">Sign Up</h1>
          <div className="">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 mb-4 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 mb-4 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-2 mb-4 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              onClick={handleSignUp}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
