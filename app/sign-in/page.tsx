"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase.config";
import Navbar from "@/components/navbar/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log(user);

      toast({
        title: "Signed in.",
        description: "You have successfully signed in.",
        variant: "default"
      });
      setEmail("");
      setPassword("");
      router.push("/");
    } catch (error) {
      toast({
        title: "Error signing in.",
        description: "There was an error signing in. Please try again.",
        variant: "destructive"
      });
      console.error(error);
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

          <h1 className="text-3xl font-bold mb-4">Sign In</h1>
          <div className="">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 mb-4  border border-gray-300 focus:outline-none focus:border-blue-500 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              onClick={handleSignIn}
            >
              Sign In
            </button>
            {/* Forgot Password  */}
            <a
              href="/forgot-password"
              className="text-blue-500 block mt-4 hover:underline"
            >
              Forgot Password?
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInPage;
