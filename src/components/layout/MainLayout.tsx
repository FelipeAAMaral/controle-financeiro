
import { ReactNode, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileHeader from "./MobileHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Get the sidebar state from localStorage or default to true on desktop, false on mobile
    const savedState = localStorage.getItem("sidebar-state");
    return savedState ? savedState === "open" : !window.matchMedia("(max-width: 768px)").matches;
  });
  
  const isMobile = useIsMobile();
  const location = useLocation();
  
  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem("sidebar-state", newState ? "open" : "closed");
  };

  // Save sidebar state on change
  useEffect(() => {
    localStorage.setItem("sidebar-state", sidebarOpen ? "open" : "closed");
  }, [sidebarOpen]);

  // Check if user is on auth pages
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);

  // If on auth page, don't show sidebar or header
  if (isAuthPage) {
    return <main className="min-h-screen bg-gray-50">{children}</main>;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar 
        open={sidebarOpen} 
        onClose={() => isMobile && setSidebarOpen(false)} 
        onToggle={toggleSidebar}
      />
      
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        sidebarOpen && !isMobile ? 'ml-64' : (isMobile ? 'ml-0' : 'ml-16')
      )}>
        {isMobile && (
          <MobileHeader 
            onMenuClick={toggleSidebar} 
            sidebarOpen={sidebarOpen}
          />
        )}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto pb-20">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
