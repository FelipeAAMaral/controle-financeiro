
import DatabaseInitializer from "@/components/database/DatabaseInitializer";

const DatabaseSetup = () => {
  return (
    <div className="container py-10 max-w-4xl mx-auto">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuração do Banco de Dados</h1>
          <p className="text-muted-foreground mt-2">
            Configure as tabelas necessárias para o funcionamento da aplicação
          </p>
        </div>
        
        <DatabaseInitializer />
      </div>
    </div>
  );
};

export default DatabaseSetup;
