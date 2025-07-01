
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  full_name: string | null;
  work_group_id: string | null;
  created_at: string;
  updated_at: string;
  work_groups?: {
    name: string;
    color: string;
  } | null;
  user_roles: Array<{
    role: 'admin' | 'work_group_leader' | 'user';
    work_group_id: string | null;
  }>;
}

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Fetching users...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          work_groups:work_group_id (
            name,
            color
          ),
          user_roles (
            role,
            work_group_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      console.log('Users fetched successfully:', data);
      return data as UserProfile[];
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      userId, 
      role, 
      workGroupId 
    }: { 
      userId: string; 
      role: 'admin' | 'work_group_leader' | 'user';
      workGroupId?: string;
    }) => {
      console.log('Updating user role:', { userId, role, workGroupId });

      // First, delete existing roles for this user
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        console.error('Error deleting existing roles:', deleteError);
        throw deleteError;
      }

      // Then insert the new role
      const roleData = {
        user_id: userId,
        role,
        work_group_id: role === 'work_group_leader' ? workGroupId : null
      };

      const { error: insertError } = await supabase
        .from('user_roles')
        .insert([roleData]);

      if (insertError) {
        console.error('Error inserting new role:', insertError);
        throw insertError;
      }

      console.log('User role updated successfully');
      return { userId, role, workGroupId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "สำเร็จ",
        description: "อัพเดทบทบาทผู้ใช้เรียบร้อยแล้ว",
      });
    },
    onError: (error) => {
      console.error('Failed to update user role:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัพเดทบทบาทผู้ใช้ได้",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateUserWorkGroup = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      userId, 
      workGroupId 
    }: { 
      userId: string; 
      workGroupId: string | null;
    }) => {
      console.log('Updating user work group:', { userId, workGroupId });

      const { error } = await supabase
        .from('profiles')
        .update({ 
          work_group_id: workGroupId,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user work group:', error);
        throw error;
      }

      console.log('User work group updated successfully');
      return { userId, workGroupId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "สำเร็จ",
        description: "อัพเดทกลุ่มงานผู้ใช้เรียบร้อยแล้ว",
      });
    },
    onError: (error) => {
      console.error('Failed to update user work group:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัพเดทกลุ่มงานผู้ใช้ได้",
        variant: "destructive",
      });
    },
  });
};
