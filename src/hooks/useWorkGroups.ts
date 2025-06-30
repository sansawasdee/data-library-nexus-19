
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useWorkGroups = () => {
  return useQuery({
    queryKey: ['work-groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('work_groups')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });
};
