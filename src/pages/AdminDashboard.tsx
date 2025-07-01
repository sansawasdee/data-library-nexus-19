
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useDatasets } from '@/hooks/useDatasets';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle, XCircle, Clock, Shield } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const AdminDashboard = () => {
  const { user, hasRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: datasets, isLoading, refetch } = useDatasets();
  const [approvalNotes, setApprovalNotes] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Redirect if not admin
  if (!authLoading && (!user || !hasRole('admin'))) {
    navigate('/auth');
    return null;
  }

  const pendingDatasets = datasets?.filter(d => d.status === 'submitted' || d.status === 'pending') || [];

  const handleApproval = async (datasetId: string, action: 'approved' | 'rejected') => {
    setProcessingId(datasetId);
    
    try {
      const { error } = await supabase
        .from('datasets')
        .update({
          status: action,
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
          approval_notes: approvalNotes || null
        })
        .eq('id', datasetId);

      if (error) throw error;

      toast({
        title: action === 'approved' ? 'อนุมัติสำเร็จ' : 'ปฏิเสธสำเร็จ',
        description: `ชุดข้อมูลได้รับการ${action === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'}แล้ว`,
      });

      setApprovalNotes('');
      refetch();
    } catch (error) {
      console.error('Error updating dataset:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถดำเนินการได้',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
      case 'pending':
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />รอการอนุมัติ</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />อนุมัติแล้ว</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />ปฏิเสธ</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>กำลังโหลด...</p>
        </div>
      </div>
    );
  }

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
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">หน้าควบคุมผู้ดูแลระบบ</h1>
          </div>
          <p className="text-gray-600">จัดการและอนุมัติชุดข้อมูลที่ส่งมาจากหัวหน้ากลุ่มงาน</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">รอการอนุมัติ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{pendingDatasets.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">อนุมัติแล้ว</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {datasets?.filter(d => d.status === 'approved').length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">ปฏิเสธ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {datasets?.filter(d => d.status === 'rejected').length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>ชุดข้อมูลที่รอการอนุมัติ</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingDatasets.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                ไม่มีชุดข้อมูลที่รอการอนุมัติ
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ชื่อชุดข้อมูล</TableHead>
                    <TableHead>เจ้าของ</TableHead>
                    <TableHead>กลุ่มงาน</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>วันที่ส่ง</TableHead>
                    <TableHead>การดำเนินการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingDatasets.map((dataset) => (
                    <TableRow key={dataset.id}>
                      <TableCell className="font-medium">{dataset.title}</TableCell>
                      <TableCell>{dataset.owner}</TableCell>
                      <TableCell>{dataset.work_groups?.name || 'ไม่ระบุ'}</TableCell>
                      <TableCell>{getStatusBadge(dataset.status)}</TableCell>
                      <TableCell>{new Date(dataset.created_at).toLocaleDateString('th-TH')}</TableCell>
                      <TableCell>
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button variant="outline" size="sm">
                              ดูรายละเอียด
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-[600px] max-w-[90vw]">
                            <SheetHeader>
                              <SheetTitle>{dataset.title}</SheetTitle>
                              <SheetDescription>
                                รายละเอียดชุดข้อมูลและการอนุมัติ
                              </SheetDescription>
                            </SheetHeader>
                            
                            <div className="mt-6 space-y-4">
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">คำอธิบาย</h4>
                                <p className="text-gray-600">{dataset.description || 'ไม่มีคำอธิบาย'}</p>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-2">เจ้าของข้อมูล</h4>
                                  <p className="text-gray-600">{dataset.owner}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-2">ระดับการเข้าถึง</h4>
                                  <p className="text-gray-600">{dataset.access_level}</p>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">หมายเหตุการอนุมัติ</h4>
                                <Textarea
                                  value={approvalNotes}
                                  onChange={(e) => setApprovalNotes(e.target.value)}
                                  placeholder="เพิ่มหมายเหตุ (ไม่บังคับ)"
                                  rows={3}
                                />
                              </div>
                              
                              <div className="flex gap-3 pt-4">
                                <Button
                                  onClick={() => handleApproval(dataset.id, 'approved')}
                                  disabled={processingId === dataset.id}
                                  className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  อนุมัติ
                                </Button>
                                <Button
                                  onClick={() => handleApproval(dataset.id, 'rejected')}
                                  disabled={processingId === dataset.id}
                                  variant="destructive"
                                  className="flex-1"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  ปฏิเสธ
                                </Button>
                              </div>
                            </div>
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

export default AdminDashboard;
