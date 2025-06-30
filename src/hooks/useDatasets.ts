
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDatasets = () => {
  return useQuery({
    queryKey: ['datasets'],
    queryFn: async () => {
      console.log('Fetching datasets from Supabase...');
      const { data, error } = await supabase
        .from('datasets')
        .select(`
          *,
          work_groups (name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching datasets:', error);
        throw error;
      }
      
      console.log('Datasets fetched successfully:', data);
      return data;
    },
  });
};
