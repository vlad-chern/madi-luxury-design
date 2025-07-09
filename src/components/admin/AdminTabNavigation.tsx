import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TabItem {
  value: string;
  label: string;
}

interface AdminTabNavigationProps {
  tabItems: TabItem[];
  isMobile?: boolean;
}

const AdminTabNavigation: React.FC<AdminTabNavigationProps> = ({ tabItems, isMobile = false }) => {
  if (isMobile) {
    return (
      <div className="flex flex-col space-y-2 p-4">
        {tabItems.map((item) => (
          <TabsTrigger 
            key={item.value}
            value={item.value} 
            className="justify-start text-left"
          >
            {item.label}
          </TabsTrigger>
        ))}
      </div>
    );
  }

  return (
    <div className="hidden lg:block">
      <TabsList className="grid w-full grid-cols-7 lg:grid-cols-8 text-sm">
        {tabItems.map((item) => (
          <TabsTrigger key={item.value} value={item.value} className="px-2 py-1.5">
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
};

export default AdminTabNavigation;