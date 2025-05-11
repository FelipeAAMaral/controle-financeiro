
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { 
  Home, PieChart, CalendarDays, FileText, Plus, User, LogOut,
  BarChart, Settings, Wallet, PiggyBank
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface SidebarLinkProps {
  to: string;
  icon: ReactNode;
  children: ReactNode;
  end?: boolean;
}

const SidebarLink = ({ to, icon, children, end = false }: SidebarLinkProps) => (
  <NavLink
    to={to}
    end={end}
    onClick={(e) => e.stopPropagation()}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "hover:bg-primary/10 hover:text-primary",
        isActive ? "bg-primary/10 text-primary" : "text-gray-700"
      )
    }
  >
    <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
    <span>{children}</span>
  </NavLink>
);

const Sidebar = ({ open, onClose }: SidebarProps) => {
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
          "fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
          "lg:translate-x-0 lg:static lg:z-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-primary">FinançasPro</h1>
            <p className="text-xs text-gray-500">Gestão financeira simplificada</p>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            <SidebarLink to="/" icon={<Home size={18} />} end>
              Dashboard
            </SidebarLink>
            <SidebarLink to="/saude-financeira" icon={<PieChart size={18} />}>
              Saúde Financeira
            </SidebarLink>
            <SidebarLink to="/controle-mensal" icon={<CalendarDays size={18} />}>
              Controle Mensal
            </SidebarLink>
            
            <div className="pt-4 pb-2">
              <p className="px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Cadastros
              </p>
            </div>
            
            <SidebarLink to="/indicadores" icon={<BarChart size={18} />}>
              Indicadores
            </SidebarLink>
            <SidebarLink to="/gastos-recorrentes" icon={<FileText size={18} />}>
              Gastos Recorrentes
            </SidebarLink>
            <SidebarLink to="/objetivos" icon={<PiggyBank size={18} />}>
              Objetivos
            </SidebarLink>
            <SidebarLink to="/transacoes" icon={<Wallet size={18} />}>
              Transações
            </SidebarLink>
            
            <div className="pt-4 pb-2">
              <p className="px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Conta
              </p>
            </div>
            
            <SidebarLink to="/perfil" icon={<User size={18} />}>
              Meu Perfil
            </SidebarLink>
            <SidebarLink to="/configuracoes" icon={<Settings size={18} />}>
              Configurações
            </SidebarLink>
          </nav>
          
          <div className="p-4 border-t mt-auto">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut size={18} className="mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
