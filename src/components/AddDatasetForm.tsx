
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useWorkGroups } from '@/hooks/useWorkGroups';
import { useCreateDataset } from '@/hooks/useCreateDataset';
import { useAuth } from '@/hooks/useAuth';
import { Database, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AddDatasetForm = () => {
  const navigate = useNavigate();
  const { data: workGroups, isLoading: workGroupsLoading } = useWorkGroups();
  const createDataset = useCreateDataset();
  const { user, hasRole, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    owner: '',
    work_group_id: '',
    access_level: 'internal' as 'public' | 'internal' | 'confidential'
  });

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    navigate('/auth');
    return null;
  }

  // Check if user has permission to add datasets
  const canAddDataset = hasRole('admin') || hasRole('work_group_leader');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.owner || !formData.work_group_id) {
      return;
    }

    createDataset.mutate(formData, {
      onSuccess: () => {
        setFormData({
          title: '',
          description: '',
          owner: '',
          work_group_id: '',
          access_level: 'internal'
        });
        navigate('/');
      }
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-2xl mx-auto">
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
              <Database className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">เพิ่มชุดข้อมูลใหม่</h1>
          </div>
          <p className="text-gray-600">กรอกข้อมูลเพื่อส่งชุดข้อมูลใหม่เพื่อขออนุมัติจากผู้ดูแลระบบ</p>
        </div>

        {!canAddDataset && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              คุณไม่มีสิทธิ์ในการเพิ่มชุดข้อมูล เฉพาะหัวหน้ากลุ่มงานและผู้ดูแลระบบเท่านั้นที่สามารถเพิ่มชุดข้อมูลได้
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>ข้อมูลชุดข้อมูล</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">ชื่อชุดข้อมูล *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="ระบุชื่อชุดข้อมูล"
                  required
                  disabled={!canAddDataset}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">คำอธิบาย</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="อธิบายรายละเอียดของชุดข้อมูล"
                  rows={4}
                  disabled={!canAddDataset}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner">เจ้าของข้อมูล *</Label>
                <Input
                  id="owner"
                  value={formData.owner}
                  onChange={(e) => handleInputChange('owner', e.target.value)}
                  placeholder="ชื่อเจ้าของหรือผู้รับผิดชอบข้อมูล"
                  required
                  disabled={!canAddDataset}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="work_group">กลุ่มงาน *</Label>
                <Select
                  value={formData.work_group_id}
                  onValueChange={(value) => handleInputChange('work_group_id', value)}
                  disabled={!canAddDataset}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกกลุ่มงาน" />
                  </SelectTrigger>
                  <SelectContent>
                    {workGroupsLoading ? (
                      <SelectItem value="" disabled>กำลังโหลด...</SelectItem>
                    ) : (
                      workGroups?.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="access_level">ระดับการเข้าถึง</Label>
                <Select
                  value={formData.access_level}
                  onValueChange={(value) => handleInputChange('access_level', value as 'public' | 'internal' | 'confidential')}
                  disabled={!canAddDataset}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">สาธารณะ</SelectItem>
                    <SelectItem value="internal">ภายใน</SelectItem>
                    <SelectItem value="confidential">ลับ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="flex-1"
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  disabled={!canAddDataset || createDataset.isPending || !formData.title || !formData.owner || !formData.work_group_id}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {createDataset.isPending ? 'กำลังส่ง...' : 'ส่งเพื่อขออนุมัติ'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddDatasetForm;
