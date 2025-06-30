
import { Database } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const DataGovernanceNotice = () => {
  return (
    <section className="mb-12">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Database className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                คณะทำงานธรรมาภิบาลข้อมูล สสจ.เชียงราย
              </h3>
              <p className="text-blue-700 mb-3">
                ระบบ Data Catalog นี้ดำเนินการภายใต้การกำกับของคณะทำงานธรรมาภิบาลข้อมูล 
                โดยมีหัวหน้ากลุ่มงานแต่ละกลุ่มทำหน้าที่เป็น Data Owner
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-100 text-blue-800">Data Owner: หัวหน้ากลุ่มงาน</Badge>
                <Badge className="bg-green-100 text-green-800">Data Steward: เจ้าหน้าที่สารสนเทศ</Badge>
                <Badge className="bg-purple-100 text-purple-800">Framework: P-HDC</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default DataGovernanceNotice;
