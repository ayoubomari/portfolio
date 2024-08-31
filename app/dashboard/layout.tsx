import React from 'react';
import Header from '@/components/layouts/Header';
import Sidebar from '@/components/layouts/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 ml-14 md:ml-52">
          {/* Main Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100/70 dark:bg-gray-900">
            <div className="px-4 lg:px-8 mx-auto ">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}