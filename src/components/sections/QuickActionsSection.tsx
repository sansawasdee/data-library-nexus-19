
import { Database, Search, Bell, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const QuickActionsSection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">การดำเนินการด่วน</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button variant="outline" className="h-16 flex flex-col items-center">
          <Database className="h-6 w-6 mb-2" />
          <span className="text-sm">สำรวจข้อมูล</span>
        </Button>
        <Button variant="outline" className="h-16 flex flex-col items-center">
          <Search className="h-6 w-6 mb-2" />
          <span className="text-sm">ค้นหาข้อมูล</span>
        </Button>
        <Button variant="outline" className="h-16 flex flex-col items-center">
          <Bell className="h-6 w-6 mb-2" />
          <span className="text-sm">คำขอข้อมูล</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-16 flex flex-col items-center"
          onClick={() => navigate('/add-dataset')}
        >
          <Tag className="h-6 w-6 mb-2" />
          <span className="text-sm">จัดการ Metadata</span>
        </Button>
      </div>
    </section>
  );
};

export default QuickActionsSection;
