import { Menu, Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

interface MobileHeaderProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

const MobileHeader = ({ onMenuClick, sidebarOpen }: MobileHeaderProps) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 border-b bg-white shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        aria-label={sidebarOpen ? "Close Menu" : "Open Menu"}
        onClick={onMenuClick}
      >
        {sidebarOpen ? <X /> : <Menu />}
      </Button>

      <h1 className="text-lg font-bold text-primary">FinançasPro</h1>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.photoURL || undefined} />
              <AvatarFallback>{user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name || 'Usuário'}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex flex-col items-start">
            <span className="font-semibold">Fatura do cartão</span>
            <span className="text-xs text-gray-500">Vence em 3 dias</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start">
            <span className="font-semibold">Meta de economia</span>
            <span className="text-xs text-gray-500">Você atingiu 80% da meta</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default MobileHeader;
