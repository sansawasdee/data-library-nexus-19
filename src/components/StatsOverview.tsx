
import { Database, Bell, Book, TreePine, Users, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWorkGroups } from '@/hooks/useWorkGroups';
import { useDatasets } from '@/hooks/useDatasets';
import { Skeleton } from '@/components/ui/skeleton';

const StatsOverview = () => {
  const { data: workGroups, isLoading: workGroupsLoading } = useWorkGroups();
  const { data: datasets, isLoading: datasetsLoading } = useDatasets();

  const pendingDatasets = datasets?.filter(d => d.status === 'pending').length || 0;

  const stats = [
    {
      title: 'กลุ่มงานทั้งหมด',
      value: workGroupsLoading ? '...' : (workGroups?.length || 0).toString(),
      icon: TreePine,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: 'กลุ่มงาน'
    },
    {
      title: 'ชุดข้อมูลทั้งหมด',
      value: datasetsLoading ? '...' : (datasets?.length || 0).toString(),
      icon: Database,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: `${datasets?.length || 0} ชุด`
    },
    {
      title: 'Data Owner',
      value: workGroupsLoading ? '...' : (workGroups?.length || 0).toString(),
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: 'หัวหน้ากลุ่มงาน'
    },
    {
      title: 'รอการอนุมัติ',
      value: datasetsLoading ? '...' : pendingDatasets.toString(),
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
                    {workGroupsLoading || datasetsLoading ? (
                      <Skeleton className="h-8 w-12" />
                    ) : (
                      <h3 className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </h3>
                    )}
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
