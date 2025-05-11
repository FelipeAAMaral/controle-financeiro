
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { 
  Home, PieChart, CalendarDays, FileText, User, LogOut,
  BarChart, Settings, Wallet, PiggyBank, ChevronLeft, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onToggle: () => void;
}

interface SidebarLinkProps {
  to: string;
  icon: ReactNode;
  children: ReactNode;
  end?: boolean;
  collapsed?: boolean;
}

const SidebarLink = ({ to, icon, children, end = false, collapsed = false }: SidebarLinkProps) => (
  <NavLink
    to={to}
    end={end}
    onClick={(e) => e.stopPropagation()}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "hover:bg-primary/10 hover:text-primary",
        isActive ? "bg-primary/10 text-primary" : "text-gray-700",
        collapsed && "justify-center px-0"
      )
    }
    title={collapsed ? String(children) : undefined}
  >
    <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
    {!collapsed && <span>{children}</span>}
  </NavLink>
);

const Sidebar = ({ open, onClose, onToggle }: SidebarProps) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {open && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-30 bg-white shadow-lg transform transition-all duration-300 ease-in-out",
          "lg:translate-x-0 flex flex-col",
          open ? "translate-x-0" : "-translate-x-full",
          open ? (
            "w-64" // Full width when open
          ) : (
            "lg:translate-x-0 lg:w-16" // Icon-only width when closed but visible on desktop
          )
        )}
      >
        <div className="flex h-full flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            {open ? (
              <>
                <div>
                  <h1 className="text-xl font-bold text-primary">FinançasPro</h1>
                  <p className="text-xs text-gray-500">Gestão financeira simplificada</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onToggle}
                  className="flex"
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeft />
                </Button>
              </>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onToggle}
                className="mx-auto flex"
                aria-label="Expand sidebar"
              >
                <ChevronRight />
              </Button>
            )}
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            <SidebarLink to="/" icon={<Home size={18} />} end collapsed={!open}>
              Dashboard
            </SidebarLink>
            <SidebarLink to="/saude-financeira" icon={<PieChart size={18} />} collapsed={!open}>
              Saúde Financeira
            </SidebarLink>
            <SidebarLink to="/controle-mensal" icon={<CalendarDays size={18} />} collapsed={!open}>
              Controle Mensal
            </SidebarLink>
            
            {open && (
              <div className="pt-4 pb-2">
                <p className="px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Cadastros
                </p>
              </div>
            )}
            
            <SidebarLink to="/indicadores" icon={<BarChart size={18} />} collapsed={!open}>
              Indicadores
            </SidebarLink>
            <SidebarLink to="/gastos-recorrentes" icon={<FileText size={18} />} collapsed={!open}>
              Gastos Recorrentes
            </SidebarLink>
            <SidebarLink to="/objetivos" icon={<PiggyBank size={18} />} collapsed={!open}>
              Objetivos
            </SidebarLink>
            <SidebarLink to="/transacoes" icon={<Wallet size={18} />} collapsed={!open}>
              Transações
            </SidebarLink>
            
            {open && (
              <div className="pt-4 pb-2">
                <p className="px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Conta
                </p>
              </div>
            )}
            
            <SidebarLink to="/perfil" icon={<User size={18} />} collapsed={!open}>
              Meu Perfil
            </SidebarLink>
            <SidebarLink to="/configuracoes" icon={<Settings size={18} />} collapsed={!open}>
              Configurações
            </SidebarLink>
          </nav>
          
          <div className={cn("p-4 border-t mt-auto", !open && "flex justify-center")}>
            <Button 
              variant="ghost" 
              className={cn(
                "text-gray-700 hover:text-red-600 hover:bg-red-50",
                open ? "w-full justify-start" : "p-2"
              )}
              onClick={handleLogout}
              title={!open ? "Sair" : undefined}
            >
              <LogOut size={18} className={open ? "mr-2" : ""} />
              {open && "Sair"}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
