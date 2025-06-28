
import { Database, Bell, Book, TreePine, Users, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StatsOverview = () => {
  const stats = [
    {
      title: 'กลุ่มงานทั้งหมด',
      value: '19',
      icon: TreePine,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: 'กลุ่มงาน'
    },
    {
      title: 'ชุดข้อมูลทั้งหมด',
      value: '247',
      icon: Database,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+15 ชุด'
    },
    {
      title: 'Data Owner',
      value: '19',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: 'หัวหน้ากลุ่มงาน'
    },
    {
      title: 'รอการอนุมัติ',
      value: '8',
      icon: Bell,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      change: 'รายการ'
    }
  ];

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">ภาพรวมระบบ Data Catalog</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="book-slide hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </h3>
                    <span className="text-sm text-gray-500 ml-2">
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default StatsOverview;
