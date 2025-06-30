
import { TreePine, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import CategoryShelf from '@/components/CategoryShelf';
import { useNavigate } from 'react-router-dom';

interface WorkGroupsSectionProps {
  workGroups: any[] | undefined;
  datasets: any[] | undefined;
  workGroupsLoading: boolean;
  setSelectedCategory: (category: string) => void;
}

const WorkGroupsSection = ({ 
  workGroups, 
  datasets, 
  workGroupsLoading, 
  setSelectedCategory 
}: WorkGroupsSectionProps) => {
  const navigate = useNavigate();

  // Transform workGroups data to match the expected format
  const categories = workGroups?.map(group => ({
    id: group.id,
    name: group.name,
    count: datasets?.filter(d => d.work_group_id === group.id).length || 0,
    color: group.color || '#3B82F6'
  })) || [];

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <TreePine className="h-6 w-6 mr-2 text-yellow-600" />
          กลุ่มงาน สสจ.เชียงราย
        </h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            รวม {workGroups?.length || 0} กลุ่มงาน
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/add-dataset')}
          >
            <Plus className="h-4 w-4 mr-2" />
            เพิ่มชุดข้อมูล
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {workGroupsLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))
        ) : (
          categories.map((category) => (
            <CategoryShelf 
              key={category.id} 
              category={category}
              onClick={() => setSelectedCategory(category.id)}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default WorkGroupsSection;
