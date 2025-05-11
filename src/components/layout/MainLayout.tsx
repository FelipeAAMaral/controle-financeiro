
import { ReactNode, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileHeader from "./MobileHeader";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Check if user is on auth pages
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);

  // If on auth page, don't show sidebar or header
  if (isAuthPage) {
    return <main className="min-h-screen bg-gray-50">{children}</main>;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar open={!isMobile || sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col">
        {isMobile && <MobileHeader onMenuClick={toggleSidebar} />}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto pb-20">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
