
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useWorkGroups = () => {
  return useQuery({
    queryKey: ['work-groups'],
    queryFn: async () => {
      console.log('Fetching work groups from Supabase...');
      const { data, error } = await supabase
        .from('work_groups')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching work groups:', error);
        throw error;
      }
      
      console.log('Work groups fetched successfully:', data);
      return data;
    },
  });
};
