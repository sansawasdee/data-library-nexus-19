
import { Calendar, Database, Bell, Book } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Dataset {
  id: string; // เปลี่ยนจาก number เป็น string เพื่อให้ตรงกับ UUID
  title: string;
  description: string;
  category: string;
  owner: string;
  lastUpdated: string;
  status: 'approved' | 'pending' | 'rejected';
  accessLevel: 'public' | 'internal' | 'confidential';
}

interface DatasetCardProps {
  dataset: Dataset;
}

const DatasetCard = ({ dataset }: DatasetCardProps) => {
  const statusColors = {
    approved: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const accessColors = {
    public: 'bg-blue-100 text-blue-800',
    internal: 'bg-purple-100 text-purple-800',
    confidential: 'bg-red-100 text-red-800'
  };

  const statusText = {
    approved: 'อนุมัติแล้ว',
    pending: 'รออนุมัติ',
    rejected: 'ปฏิเสธ'
  };

  const accessText = {
    public: 'สาธารณะ',
    internal: 'ภายใน',
    confidential: 'ลับ'
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 book-slide border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="bg-blue-50 p-2 rounded-lg">
            <Database className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex flex-col gap-1">
            <Badge className={statusColors[dataset.status]}>
              {statusText[dataset.status]}
            </Badge>
            <Badge variant="outline" className={accessColors[dataset.accessLevel]}>
              {accessText[dataset.accessLevel]}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <CardTitle className="text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {dataset.title}
          </CardTitle>
          <p className="text-sm text-gray-600 line-clamp-2">
            {dataset.description}
          </p>
        </div>

        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center">
            <Book className="h-4 w-4 mr-2" />
            <span>หมวด: {dataset.category}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">👤</span>
            <span>เจ้าของ: {dataset.owner}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>อัปเดต: {new Date(dataset.lastUpdated).toLocaleDateString('th-TH')}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1">
            ดูรายละเอียด
          </Button>
          <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
            ขอข้อมูล
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatasetCard;
