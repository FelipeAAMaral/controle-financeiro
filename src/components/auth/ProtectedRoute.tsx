
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, session } = useAuth();
  const location = useLocation();

  // Add debug logs
  console.log("ProtectedRoute - Auth state:", { user, loading, session, path: location.pathname });

  // Show a loading state while checking authentication
  if (loading) {
    console.log("ProtectedRoute - Loading auth state");
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!session || !user) {
    console.log("ProtectedRoute - Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the children
  console.log("ProtectedRoute - User authenticated, rendering protected content");
  return children;
};

export default ProtectedRoute;
