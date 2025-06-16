'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header'; // Assuming Header is in components folder
import DynamicNav from '../HR_RECRUiTER/DynamicNav'; // Assuming DynamicNav is shared and located here

export default function InterviewerLayout({
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
      <DynamicNav onExpandChange={handleNavExpandChange} userRole="interviewer" />
      <div className={`flex-1 pt-16 ${isNavExpanded ? 'ml-64' : 'ml-20'} transition-all duration-300 ease-in-out overflow-y-auto h-screen`}>
        <Header isNavExpanded={isNavExpanded} />
        <main className="p-6 bg-transparent min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}