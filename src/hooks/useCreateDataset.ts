
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateDatasetData {
  title: string;
  description?: string;
  owner: string;
  work_group_id: string;
  access_level: 'public' | 'internal' | 'confidential';
  submitted_by?: string;
}

export const useCreateDataset = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateDatasetData) => {
      console.log('Creating new dataset:', data);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      const datasetData = {
        ...data,
        submitted_by: user?.id,
        status: 'submitted' // Set status to submitted when created by work group leader
      };
      
      const { data: result, error } = await supabase
        .from('datasets')
        .insert([datasetData])
        .select()
        .single();

      if (error) {
        console.error('Error creating dataset:', error);
        throw error;
      }

      console.log('Dataset created successfully:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
      toast({
        title: "สำเร็จ",
        description: "ส่งชุดข้อมูลเพื่อขออนุมัติเรียบร้อยแล้ว",
      });
    },
    onError: (error) => {
      console.error('Failed to create dataset:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถส่งชุดข้อมูลได้ กรุณาตรวจสอบสิทธิ์การเข้าถึง",
        variant: "destructive",
      });
    },
  });
};
