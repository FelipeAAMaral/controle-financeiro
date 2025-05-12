
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { useAuthProvider } from "./hooks/useAuth";
import AppRoutes from "./routes";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  const { AuthProvider } = useAuthProvider();
  const [initialChecked, setInitialChecked] = useState(false);

  useEffect(() => {
    // Initial session check to ensure Supabase auth is initialized
    const checkInitialSession = async () => {
      try {
        console.log("App - Initial session check");
        await supabase.auth.getSession();
        console.log("App - Initial session check complete");
      } catch (error) {
        console.error("Error during initial session check:", error);
      } finally {
        setInitialChecked(true);
      }
    };

    checkInitialSession();
  }, []);

  // Add console log to check app rendering
  console.log("Rendering App component, initialChecked:", initialChecked);

  if (!initialChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <AppRoutes />
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
