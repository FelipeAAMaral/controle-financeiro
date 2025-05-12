
import { createContext } from "react";
import { AuthContextType } from "@/types/auth";

// Create the auth context with default undefined value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
