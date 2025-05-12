
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { initializeDatabase } from '@/services/databaseInitService';
import { useAuth } from '@/hooks/useAuth';
import { ArrowRight, Database, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DatabaseInitializer = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleInitializeDatabase = async () => {
    if (!user) return;
    
    setIsInitializing(true);
    try {
      const result = await initializeDatabase();
      setIsInitialized(result);
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" /> Configuração do Banco de Dados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Este assistente irá configurar as tabelas necessárias no seu banco de dados Supabase.
          As tabelas incluem perfis de usuários, transações, objetivos financeiros, viagens, investimentos e mais.
        </p>
        
        {isInitialized && (
          <div className="bg-green-50 p-4 rounded-md border border-green-200 text-green-800">
            <p className="font-medium">Banco de dados configurado com sucesso!</p>
            <p className="text-sm mt-1">Todas as tabelas foram criadas e as permissões configuradas.</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          disabled={isInitializing}
        >
          Voltar
        </Button>
        <Button 
          onClick={handleInitializeDatabase}
          disabled={isInitializing}
        >
          {isInitializing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Configurando...
            </>
          ) : isInitialized ? (
            <>
              Continuar <ArrowRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Configurar Banco de Dados
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DatabaseInitializer;
