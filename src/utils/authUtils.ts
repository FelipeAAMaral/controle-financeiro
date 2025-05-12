
import { User, Session } from "@supabase/supabase-js";
import { AuthUser } from "@/types/auth";

// Helper function to convert Supabase user to our AuthUser type
export const formatUser = (user: User, session: Session | null): AuthUser => {
  const userData = user.user_metadata || {};
  
  return {
    id: user.id,
    email: user.email || '',
    name: userData.name || userData.full_name || user.email?.split('@')[0] || null,
    photoURL: userData.avatar_url || null,
    provider: userData.provider || 'email'
  };
};
