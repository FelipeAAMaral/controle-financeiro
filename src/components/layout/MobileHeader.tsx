
import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

const MobileHeader = ({ onMenuClick }: MobileHeaderProps) => {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 border-b bg-white shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Menu"
        onClick={onMenuClick}
      >
        <Menu />
      </Button>

      <h1 className="text-lg font-bold text-primary">FinançasPro</h1>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Notificações</DropdownMenuLabel>
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
