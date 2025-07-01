
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUsers, useUpdateUserRole, useUpdateUserWorkGroup } from '@/hooks/useUsers';
import { useWorkGroups } from '@/hooks/useWorkGroups';
import { ArrowLeft, Shield, Users, UserCheck, UserX } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const UserManagement = () => {
  const { user, hasRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: workGroups } = useWorkGroups();
  const updateUserRole = useUpdateUserRole();
  const updateUserWorkGroup = useUpdateUserWorkGroup();
  
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Redirect if not admin
  if (!authLoading && (!user || !hasRole('admin'))) {
    navigate('/auth');
    return null;
  }

  const getRoleBadge = (roles: any[]) => {
    const primaryRole = roles[0]?.role || 'user';
    switch (primaryRole) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-800"><Shield className="h-3 w-3 mr-1" />ผู้ดูแลระบบ</Badge>;
      case 'work_group_leader':
        return <Badge className="bg-blue-100 text-blue-800"><UserCheck className="h-3 w-3 mr-1" />หัวหน้ากลุ่มงาน</Badge>;
      default:
        return <Badge variant="secondary"><Users className="h-3 w-3 mr-1" />ผู้ใช้งาน</Badge>;
    }
  };

  const handleRoleChange = async (userId: string, newRole: string, workGroupId?: string) => {
    updateUserRole.mutate({
      userId,
      role: newRole as 'admin' | 'work_group_leader' | 'user',
      workGroupId
    });
  };

  const handleWorkGroupChange = async (userId: string, workGroupId: string | null) => {
    updateUserWorkGroup.mutate({ userId, workGroupId });
  };

  if (authLoading || usersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  const adminUsers = users?.filter(u => u.user_roles.some(r => r.role === 'admin')) || [];
  const workGroupLeaders = users?.filter(u => u.user_roles.some(r => r.role === 'work_group_leader')) || [];
  const regularUsers = users?.filter(u => u.user_roles.some(r => r.role === 'user')) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับหน้าหลัก
          </Button>
          
          <div className="flex items-center mb-2">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">จัดการผู้ใช้งาน</h1>
          </div>
          <p className="text-gray-600">จัดการบทบาทและสิทธิ์การเข้าถึงของผู้ใช้งานในระบบ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-red-600" />
                ผู้ดูแลระบบ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{adminUsers.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <UserCheck className="h-4 w-4 mr-2 text-blue-600" />
                หัวหน้ากลุ่มงาน
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{workGroupLeaders.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Users className="h-4 w-4 mr-2 text-gray-600" />
                ผู้ใช้งานทั่วไป
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{regularUsers.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>รายชื่อผู้ใช้งาน</CardTitle>
          </CardHeader>
          <CardContent>
            {!users || users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                ไม่มีผู้ใช้งานในระบบ
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ชื่อผู้ใช้</TableHead>
                    <TableHead>บทบาท</TableHead>
                    <TableHead>กลุ่มงาน</TableHead>
                    <TableHead>วันที่สมัคร</TableHead>
                    <TableHead>การจัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.full_name || 'ไม่ระบุชื่อ'}
                      </TableCell>
                      <TableCell>{getRoleBadge(user.user_roles)}</TableCell>
                      <TableCell>
                        {user.work_groups ? (
                          <Badge 
                            variant="outline" 
                            style={{ 
                              borderColor: user.work_groups.color,
                              color: user.work_groups.color 
                            }}
                          >
                            {user.work_groups.name}
                          </Badge>
                        ) : (
                          <span className="text-gray-500">ไม่ระบุ</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString('th-TH')}
                      </TableCell>
                      <TableCell>
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                            >
                              จัดการ
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-[500px] max-w-[90vw]">
                            <SheetHeader>
                              <SheetTitle>จัดการผู้ใช้: {selectedUser?.full_name || 'ไม่ระบุชื่อ'}</SheetTitle>
                              <SheetDescription>
                                แก้ไขบทบาทและกลุ่มงานของผู้ใช้
                              </SheetDescription>
                            </SheetHeader>
                            
                            {selectedUser && (
                              <div className="mt-6 space-y-6">
                                <div>
                                  <label className="text-sm font-medium text-gray-900 mb-2 block">
                                    บทบาท
                                  </label>
                                  <Select
                                    value={selectedUser.user_roles[0]?.role || 'user'}
                                    onValueChange={(value) => handleRoleChange(selectedUser.id, value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="เลือกบทบาท" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="user">ผู้ใช้งานทั่วไป</SelectItem>
                                      <SelectItem value="work_group_leader">หัวหน้ากลุ่มงาน</SelectItem>
                                      <SelectItem value="admin">ผู้ดูแลระบบ</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <label className="text-sm font-medium text-gray-900 mb-2 block">
                                    กลุ่มงาน
                                  </label>
                                  <Select
                                    value={selectedUser.work_group_id || 'none'}
                                    onValueChange={(value) => 
                                      handleWorkGroupChange(
                                        selectedUser.id, 
                                        value === 'none' ? null : value
                                      )
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="เลือกกลุ่มงาน" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="none">ไม่ระบุกลุ่มงาน</SelectItem>
                                      {workGroups?.map((group) => (
                                        <SelectItem key={group.id} value={group.id}>
                                          {group.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="pt-4 border-t">
                                  <h4 className="font-medium text-gray-900 mb-2">ข้อมูลเพิ่มเติม</h4>
                                  <div className="space-y-2 text-sm text-gray-600">
                                    <p><strong>ID:</strong> {selectedUser.id}</p>
                                    <p><strong>วันที่สมัคร:</strong> {new Date(selectedUser.created_at).toLocaleDateString('th-TH')}</p>
                                    <p><strong>อัพเดทล่าสุด:</strong> {new Date(selectedUser.updated_at).toLocaleDateString('th-TH')}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </SheetContent>
                        </Sheet>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;
