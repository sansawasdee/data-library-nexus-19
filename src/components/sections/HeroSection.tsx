
import { Book } from 'lucide-react';
import QuickSearch from '@/components/QuickSearch';

const HeroSection = () => {
  return (
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
  );
};

export default HeroSection;
