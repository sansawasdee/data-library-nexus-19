
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LibraryHeader from '@/components/LibraryHeader';
import StatsOverview from '@/components/StatsOverview';
import HeroSection from '@/components/sections/HeroSection';
import DataGovernanceNotice from '@/components/sections/DataGovernanceNotice';
import WorkGroupsSection from '@/components/sections/WorkGroupsSection';
import RecentDatasetsSection from '@/components/sections/RecentDatasetsSection';
import DataGovernanceProcess from '@/components/sections/DataGovernanceProcess';
import QuickActionsSection from '@/components/sections/QuickActionsSection';
import { useWorkGroups } from '@/hooks/useWorkGroups';
import { useDatasets } from '@/hooks/useDatasets';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogIn, LogOut, Settings, User } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { data: workGroups, isLoading: workGroupsLoading } = useWorkGroups();
  const { data: datasets, isLoading: datasetsLoading } = useDatasets();
  const { user, profile, hasRole, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* User Status Bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      {profile?.full_name || user.email}
                    </span>
                  </div>
                  {hasRole('admin') && (
                    <Badge className="bg-red-100 text-red-800">ผู้ดูแลระบบ</Badge>
                  )}
                  {hasRole('work_group_leader') && (
                    <Badge className="bg-blue-100 text-blue-800">หัวหน้ากลุ่มงาน</Badge>
                  )}
                </>
              ) : (
                <span className="text-sm text-gray-500">ไม่ได้เข้าสู่ระบบ</span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {user ? (
                <>
                  {hasRole('admin') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/admin')}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      จัดการระบบ
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    ออกจากระบบ
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/auth')}
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  เข้าสู่ระบบ
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <LibraryHeader />
      
      <HeroSection />

      <div className="container mx-auto px-6 py-8">
        <StatsOverview />
        
        <DataGovernanceNotice />

        <WorkGroupsSection 
          workGroups={workGroups}
          datasets={datasets}
          workGroupsLoading={workGroupsLoading}
          setSelectedCategory={setSelectedCategory}
        />

        <RecentDatasetsSection 
          datasets={datasets}
          datasetsLoading={datasetsLoading}
        />

        <DataGovernanceProcess />

        <QuickActionsSection />
      </div>
    </div>
  );
};

export default Index;
