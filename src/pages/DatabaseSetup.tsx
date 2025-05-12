
import DatabaseInitializer from "@/components/database/DatabaseInitializer";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

const DatabaseSetup = () => {
  return (
    <div className="container py-10 max-w-4xl mx-auto">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuração do Banco de Dados</h1>
          <p className="text-muted-foreground mt-2">
            Configure as tabelas necessárias para o funcionamento da aplicação
          </p>
          <div className="mt-4">
            <Link 
              to="/DATABASE_MIGRATIONS.md" 
              target="_blank" 
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <FileText className="h-4 w-4 mr-1" />
              Ver documentação completa sobre migrações
            </Link>
          </div>
        </div>
        
        <DatabaseInitializer />
      </div>
    </div>
  );
};

export default DatabaseSetup;
