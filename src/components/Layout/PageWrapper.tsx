import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface PageWrapperProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ title, subtitle, children }) => (
  <div className="flex h-screen overflow-hidden bg-surface-900">
    <Sidebar />
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <Header title={title} subtitle={subtitle} />
      <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
        {children}
      </main>
    </div>
  </div>
);

export default PageWrapper;
