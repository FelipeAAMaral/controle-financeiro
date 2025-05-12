
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// A hook to easily fetch any user-related data
export function useUserData<T>(
  tableName: string,
  options: {
    enabled?: boolean;
  } = {}
) {
  const { user } = useAuth();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { enabled = true } = options;

  useEffect(() => {
    // Only fetch if enabled and user is authenticated
    if (!enabled || !user) {
      setLoading(false);
      return;
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('user_id', user.id);
          
        if (error) {
          throw error;
        }
        
        setData(data || []);
      } catch (err) {
        console.error(`Error fetching data from ${tableName}:`, err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        toast.error(`Erro ao carregar dados: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [tableName, user, enabled]);

  // Function to refresh the data
  const refreshData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setData(data || []);
    } catch (err) {
      console.error(`Error refreshing data from ${tableName}:`, err);
      toast.error('Erro ao atualizar dados');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refreshData };
}
