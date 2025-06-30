
import { Database, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import DatasetCard from '@/components/DatasetCard';
import { useNavigate } from 'react-router-dom';

interface RecentDatasetsSectionProps {
  datasets: any[] | undefined;
  datasetsLoading: boolean;
}

const RecentDatasetsSection = ({ datasets, datasetsLoading }: RecentDatasetsSectionProps) => {
  const navigate = useNavigate();

  // Transform datasets data to match the expected format
  const recentDatasets = datasets?.slice(0, 6).map(dataset => ({
    id: dataset.id,
    title: dataset.title,
    description: dataset.description || '',
    category: dataset.work_groups?.name || 'ไม่ระบุ',
    owner: dataset.owner,
    lastUpdated: dataset.last_updated || dataset.created_at?.split('T')[0] || '',
    status: dataset.status as 'approved' | 'pending' | 'rejected',
    accessLevel: dataset.access_level as 'public' | 'internal' | 'confidential'
  })) || [];

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Database className="h-6 w-6 mr-2 text-blue-600" />
          ชุดข้อมูลล่าสุด
        </h2>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate('/add-dataset')}
        >
          <Plus className="h-4 w-4 mr-2" />
          เพิ่มชุดข้อมูลใหม่
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {datasetsLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))
        ) : recentDatasets.length > 0 ? (
          recentDatasets.map((dataset) => (
            <DatasetCard key={dataset.id} dataset={dataset} />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">ยังไม่มีชุดข้อมูล</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentDatasetsSection;
