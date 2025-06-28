
import { useState } from 'react';
import { Bell, Book, Search, Database, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LibraryHeader = () => {
  const [notifications] = useState(3);

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Book className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">OpenLib Data Catalog</h1>
              <p className="text-sm text-gray-500">ห้องสมุดข้อมูลดิจิทัล</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
              <Database className="h-4 w-4 mr-2" />
              ชุดข้อมูล
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
              <Search className="h-4 w-4 mr-2" />
              ค้นหา
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
              คำขอ
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
              รายงาน
            </Button>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              เพิ่มข้อมูล
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-red-500">
                  {notifications}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      ผู
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">ผู้ใช้งาน</p>
                    <p className="text-xs text-gray-500">Data Owner</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>โปรไฟล์</DropdownMenuItem>
                <DropdownMenuItem>การตั้งค่า</DropdownMenuItem>
                <DropdownMenuItem>ประวัติการใช้งาน</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  ออกจากระบบ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LibraryHeader;
