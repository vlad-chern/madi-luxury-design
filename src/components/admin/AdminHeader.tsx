import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LogOut, Globe, Menu } from 'lucide-react';
import { adminTranslations } from '@/utils/adminTranslations';
import AdminTabNavigation from './AdminTabNavigation';

interface AdminHeaderProps {
  language: 'es' | 'en' | 'ru';
  setLanguage: (language: 'es' | 'en' | 'ru') => void;
  onLogout: () => void;
  tabItems: Array<{ value: string; label: string }>;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  language,
  setLanguage,
  onLogout,
  tabItems
}) => {
  const t = adminTranslations[language];

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">{t.title}</h1>
            
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <div className="py-4">
                  <h2 className="text-lg font-semibold mb-4">Navegación</h2>
                  <AdminTabNavigation tabItems={tabItems} isMobile={true} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <Select value={language} onValueChange={(value: 'es' | 'en' | 'ru') => setLanguage(value)}>
              <SelectTrigger className="w-24 md:w-32">
                <Globe className="w-4 h-4 mr-1 md:mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">ES</SelectItem>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="ru">RU</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={onLogout} variant="outline" size="sm" className="text-xs md:text-sm">
              <LogOut className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">{t.logout}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;