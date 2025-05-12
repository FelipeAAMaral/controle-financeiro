
import { createContext, ReactNode, useState } from "react";
import { AuthContextType } from "@/types/auth";

// Create the auth context with default undefined value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // This is just a wrapper component that will be implemented in useAuthProvider
  return <AuthContext.Provider value={undefined as any}>{children}</AuthContext.Provider>;
};
