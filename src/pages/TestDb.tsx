import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DbStatus {
  connected: boolean;
  error?: string;
  details?: string;
}

const TestDb = () => {
  const [status, setStatus] = useState<DbStatus>({
    connected: false,
  });
  const [loading, setLoading] = useState(true);
  const [testUser, setTestUser] = useState<{ email: string; password: string }>({
    email: `test-${Date.now()}@example.com`,
    password: "test123456",
  });

  const checkConnection = async () => {
    try {
      setLoading(true);
      setStatus({ connected: false });

      // Testar conexão básica
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(`Erro na conexão: ${sessionError.message}`);
      }

      // Testar acesso ao banco
      const { data: tables, error: tablesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

      if (tablesError) {
        throw new Error(`Erro ao acessar tabelas: ${tablesError.message}`);
      }

      setStatus({
        connected: true,
        details: "Conexão com o banco de dados estabelecida com sucesso!"
      });
    } catch (error) {
      console.error("Erro ao testar conexão:", error);
      setStatus({
        connected: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
        details: error instanceof Error ? error.stack : undefined
      });
    } finally {
      setLoading(false);
    }
  };

  const testUserCreation = async () => {
    try {
      setLoading(true);
      
      // Criar usuário
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: testUser.email,
        password: testUser.password,
      });

      if (authError) {
        throw new Error(`Erro ao criar usuário: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error("Usuário não foi criado corretamente");
      }

      // Verificar se o perfil foi criado
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        throw new Error(`Erro ao verificar perfil: ${profileError.message}`);
      }

      if (!profile) {
        throw new Error("Perfil não foi criado automaticamente");
      }

      setStatus({
        connected: true,
        details: `Teste completo! Usuário criado com sucesso (${testUser.email}) e perfil gerado.`
      });

    } catch (error) {
      console.error("Erro ao testar criação de usuário:", error);
      setStatus({
        connected: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
        details: error instanceof Error ? error.stack : undefined
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="container max-w-2xl py-6">
      <Card>
        <CardHeader>
          <CardTitle>Teste de Conexão com o Banco de Dados</CardTitle>
          <CardDescription>
            Verifica a conexão com o Supabase e testa a criação de usuário
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <Alert variant={status.connected ? "default" : "destructive"}>
                <AlertTitle>
                  {status.connected ? "Conexão Estabelecida" : "Erro de Conexão"}
                </AlertTitle>
                <AlertDescription>
                  {status.connected
                    ? status.details
                    : status.error || "Não foi possível conectar ao banco de dados"}
                </AlertDescription>
              </Alert>

              {status.details && !status.connected && (
                <pre className="p-4 bg-gray-100 rounded-lg overflow-auto text-sm">
                  {status.details}
                </pre>
              )}

              <div className="flex gap-4">
                <Button
                  onClick={checkConnection}
                  disabled={loading}
                  variant="outline"
                >
                  Testar Conexão
                </Button>
                <Button
                  onClick={testUserCreation}
                  disabled={loading}
                >
                  Testar Criação de Usuário
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestDb; 