
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTags = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      console.log('Fetching tags from Supabase...');
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching tags:', error);
        throw error;
      }
      
      console.log('Tags fetched successfully:', data);
      return data;
    },
  });
};
