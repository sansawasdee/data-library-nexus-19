
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

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data for demonstration
  const categories = [
    { id: 'public-service', name: 'บริการประชาชน', count: 24, color: 'bg-blue-500' },
    { id: 'health-stats', name: 'สถิติสุขภาพ', count: 18, color: 'bg-green-500' },
    { id: 'budget', name: 'งบประมาณ', count: 12, color: 'bg-yellow-500' },
    { id: 'education', name: 'การศึกษา', count: 15, color: 'bg-purple-500' },
    { id: 'transport', name: 'คมนาคม', count: 9, color: 'bg-orange-500' },
    { id: 'environment', name: 'สิ่งแวดล้อม', count: 7, color: 'bg-teal-500' }
  ];

  const recentDatasets = [
    {
      id: 1,
      title: 'ข้อมูลสถิติประชากรกรุงเทพฯ 2567',
      description: 'สถิติประชากรแยกตามเขต อายุ และเพศ',
      category: 'สถิติสุขภาพ',
      owner: 'กรุงเทพมหานคร',
      lastUpdated: '2024-01-15',
      status: 'approved' as const,
      accessLevel: 'public' as const
    },
    {
      id: 2,
      title: 'งบประมาณโครงการพัฒนาดิจิทัล',
      description: 'รายละเอียดงบประมาณและการใช้จ่าย',
      category: 'งบประมาณ',
      owner: 'กระทรวงดิจิทัลฯ',
      lastUpdated: '2024-01-10',
      status: 'pending' as const,
      accessLevel: 'internal' as const
    },
    {
      id: 3,
      title: 'ข้อมูลคุณภาพอากาศรายวัน',
      description: 'ค่า PM2.5 และดัชนีคุณภาพอากาศ',
      category: 'สิ่งแวดล้อม',
      owner: 'กรมควบคุมมลพิษ',
      lastUpdated: '2024-01-12',
      status: 'approved' as const,
      accessLevel: 'public' as const
    }
  ];

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
                OpenLib Data Catalog
              </h1>
            </div>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              ห้องสมุดข้อมูลดิจิทัล สำหรับการจัดการและแบ่งปันข้อมูลขององค์กรภาครัฐอย่างเป็นระบบ
            </p>
            <QuickSearch />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <StatsOverview />

        {/* Category Shelves */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <TreePine className="h-6 w-6 mr-2 text-yellow-600" />
              หมวดหมู่ข้อมูล
            </h2>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              เพิ่มหมวดหมู่
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryShelf 
                key={category.id} 
                category={category}
                onClick={() => setSelectedCategory(category.id)}
              />
            ))}
          </div>
        </section>

        {/* Recent Datasets */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Database className="h-6 w-6 mr-2 text-blue-600" />
              ชุดข้อมูลล่าสุด
            </h2>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              เพิ่มชุดข้อมูล
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {recentDatasets.map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset} />
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">การดำเนินการด่วน</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16 flex flex-col items-center">
              <Database className="h-6 w-6 mb-2" />
              <span className="text-sm">เพิ่มข้อมูล</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center">
              <Search className="h-6 w-6 mb-2" />
              <span className="text-sm">ค้นหาข้อมูล</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center">
              <Bell className="h-6 w-6 mb-2" />
              <span className="text-sm">คำขอรออนุมัติ</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center">
              <Tag className="h-6 w-6 mb-2" />
              <span className="text-sm">จัดการแท็ก</span>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
