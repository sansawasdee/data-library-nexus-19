
import { useState } from 'react';
import { Search, Database, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const QuickSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const popularTags = [
    'สถิติประชากร', 'งบประมาณ', 'สุขภาพ', 'การศึกษา', 
    'คมนาคม', 'สิ่งแวดล้อม', 'ภาษี', 'การเงิน'
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      console.log('Searching for:', searchQuery);
      setIsSearching(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Main Search Bar */}
      <div className="relative mb-6">
        <div className="flex">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="ค้นหาชุดข้อมูล, หมวดหมู่, หรือคำอธิบาย..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-12 pr-4 py-3 text-lg bg-white/90 backdrop-blur-sm border-2 border-white/50 focus:border-yellow-400 rounded-l-lg"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-r-lg border-2 border-yellow-500"
          >
            {isSearching ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                ค้นหา
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Popular Tags */}
      <div className="text-center">
        <p className="text-blue-100 mb-3">แท็กยอดนิยม:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {popularTags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-white/20 text-white hover:bg-white/30 cursor-pointer transition-colors px-3 py-1"
              onClick={() => setSearchQuery(tag)}
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Advanced Search Link */}
      <div className="text-center mt-4">
        <Button variant="link" className="text-blue-200 hover:text-white">
          <Database className="h-4 w-4 mr-2" />
          การค้นหาขั้นสูง
        </Button>
      </div>
    </div>
  );
};

export default QuickSearch;
