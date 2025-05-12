
import { createContext } from "react";
import { AuthContextType } from "@/types/auth";

// Create the auth context with a default value that matches the shape of AuthContextType
// but with sensible defaults rather than undefined
export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  error: null,
  login: async () => {},
  loginWithGoogle: async () => {},
  register: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  updateProfile: async () => {},
  fetchUserProfile: async () => {}
});
