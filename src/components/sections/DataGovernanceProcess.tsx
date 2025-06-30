
import { Card, CardContent } from '@/components/ui/card';

const DataGovernanceProcess = () => {
  return (
    <section className="mb-12">
      <h3 className="text-xl font-semibold mb-6 text-gray-900">ขั้นตอนการดำเนินงาน Data Catalog</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="bg-blue-100 p-3 rounded-full mx-auto mb-3 w-fit">
              <span className="text-blue-600 font-bold text-lg">1</span>
            </div>
            <h4 className="font-semibold mb-2">เตรียมความพร้อม</h4>
            <p className="text-sm text-gray-600">แต่งตั้งคณะทำงาน Data Owner & Steward</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="bg-green-100 p-3 rounded-full mx-auto mb-3 w-fit">
              <span className="text-green-600 font-bold text-lg">2</span>
            </div>
            <h4 className="font-semibold mb-2">รวบรวมข้อมูล</h4>
            <p className="text-sm text-gray-600">สำรวจและจัดทำ Metadata</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="bg-yellow-100 p-3 rounded-full mx-auto mb-3 w-fit">
              <span className="text-yellow-600 font-bold text-lg">3</span>
            </div>
            <h4 className="font-semibold mb-2">จัดหมวดหมู่</h4>
            <p className="text-sm text-gray-600">Classification & Catalog System</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="bg-purple-100 p-3 rounded-full mx-auto mb-3 w-fit">
              <span className="text-purple-600 font-bold text-lg">4</span>
            </div>
            <h4 className="font-semibold mb-2">ใช้ประโยชน์</h4>
            <p className="text-sm text-gray-600">Dashboard & Data for Decision</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DataGovernanceProcess;
