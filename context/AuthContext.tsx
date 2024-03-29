/* eslint-disable react/prop-types */
// import { createContext, useContext, useEffect, useState } from "react";
"use client";

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { app as firebaseApp } from "@/firebase/firebase.config";
import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { User as FirebaseUser } from "firebase/auth";

interface AuthContextValue {
  user: FirebaseUser | null;
  login: (email: string, password: string, redirectTo: string) => Promise<void>;
  logout: (redirectTo: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: async () => {},
  logout: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string, redirectTo: string) => {
    const auth = getAuth(firebaseApp);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push(redirectTo);
    } catch (error) {
      console.error(error);
      toast({
        title: "Login Error",
        description: "The email or password is incorrect.",
        variant: "destructive"
      });
    }
  };

  const logout = async (redirectTo: string) => {
    const auth = getAuth(firebaseApp);
    try {
      await signOut(auth);
      router.push(redirectTo);
    } catch (error) {
      console.error(error);
      toast({
        title: "Logout Error",
        description: "There was an error logging out.",
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
