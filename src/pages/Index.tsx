
import { useState } from 'react';
import { Search, Book, Database, Plus, Bell, TreePine, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import LibraryHeader from '@/components/LibraryHeader';
import CategoryShelf from '@/components/CategoryShelf';
import DatasetCard from '@/components/DatasetCard';
import StatsOverview from '@/components/StatsOverview';
import QuickSearch from '@/components/QuickSearch';
import { useWorkGroups } from '@/hooks/useWorkGroups';
import { useDatasets } from '@/hooks/useDatasets';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { data: workGroups, isLoading: workGroupsLoading } = useWorkGroups();
  const { data: datasets, isLoading: datasetsLoading } = useDatasets();

  // Transform workGroups data to match the expected format
  const categories = workGroups?.map(group => ({
    id: group.id,
    name: group.name,
    count: datasets?.filter(d => d.work_group_id === group.id).length || 0,
    color: group.color || '#3B82F6'
  })) || [];

  // Transform datasets data to match the expected format - แก้ไข id type
  const recentDatasets = datasets?.slice(0, 6).map(dataset => ({
    id: dataset.id, // ใช้ string UUID แทน number
    title: dataset.title,
    description: dataset.description || '',
    category: dataset.work_groups?.name || 'ไม่ระบุ',
    owner: dataset.owner,
    lastUpdated: dataset.last_updated || dataset.created_at?.split('T')[0] || '',
    status: dataset.status as 'approved' | 'pending' | 'rejected',
    accessLevel: dataset.access_level as 'public' | 'internal' | 'confidential'
  })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <LibraryHeader />
      
      {/* Hero Section - Library Style */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="absolute inset-0 opacity-10"></div>
        <div className="container mx-auto px-6 py-16 relative">
          <div className="text-center">
            <div className="flex justify-center items-center mb-6">
              <div className="bg-yellow-400 p-4 rounded-full mr-4">
                <Book className="h-12 w-12 text-blue-900" />
              </div>
              <h1 className="text-5xl font-bold">
                Data Catalog สสจ.เชียงราย
              </h1>
            </div>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              ระบบบัญชีข้อมูลสำนักงานสาธารณสุขจังหวัดเชียงราย สำหรับการจัดการและแบ่งปันข้อมูลตามกลุ่มงานอย่างเป็นระบบ
            </p>
            <QuickSearch />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <StatsOverview />

        {/* Data Governance Notice */}
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

        {/* Work Groups Categories */}
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

        {/* Recent Datasets */}
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

        {/* Data Governance Process */}
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

        {/* Quick Actions */}
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
      </div>
    </div>
  );
};

export default Index;
