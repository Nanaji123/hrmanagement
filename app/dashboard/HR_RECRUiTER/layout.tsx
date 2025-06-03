'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import DynamicNav from './DynamicNav';

export default function HrRecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleNavExpandChange = (expanded: boolean) => {
    setIsNavExpanded(expanded);
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d25] to-[#0d1021] flex">
      <DynamicNav onExpandChange={handleNavExpandChange} userRole="hr_recruiter" />
      <div className={`flex-1 pt-16 ${isNavExpanded ? 'ml-34' : 'ml-0'} transition-all duration-300 ease-in-out overflow-y-auto h-screen`}>
        <Header isNavExpanded={isNavExpanded} />
        <main className="px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}