
import { useState } from 'react';
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

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { data: workGroups, isLoading: workGroupsLoading } = useWorkGroups();
  const { data: datasets, isLoading: datasetsLoading } = useDatasets();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
