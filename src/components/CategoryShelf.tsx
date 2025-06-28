
import { Book, Folder } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Category {
  id: string;
  name: string;
  count: number;
  color: string;
}

interface CategoryShelfProps {
  category: Category;
  onClick: () => void;
}

const CategoryShelf = ({ category, onClick }: CategoryShelfProps) => {
  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 book-slide border-2 hover:border-yellow-400"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg ${category.color} bg-opacity-20`}>
            <Folder className={`h-6 w-6 text-gray-700`} />
          </div>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            {category.count} ชุด
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-lg mb-2 group-hover:text-blue-600 transition-colors">
          {category.name}
        </CardTitle>
        
        {/* Book Spine Effect */}
        <div className="flex space-x-1 mt-4">
          {Array.from({ length: Math.min(category.count, 8) }).map((_, i) => (
            <div 
              key={i}
              className="book-spine h-12 w-2 rounded-sm opacity-70 group-hover:opacity-100 transition-opacity"
              style={{ 
                animationDelay: `${i * 0.1}s`,
                backgroundColor: `hsl(${200 + i * 20}, 60%, ${50 + i * 5}%)`
              }}
            />
          ))}
          {category.count > 8 && (
            <div className="flex items-center text-xs text-gray-500 ml-2">
              +{category.count - 8}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryShelf;
