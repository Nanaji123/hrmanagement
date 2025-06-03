'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import DynamicNav from '../HR_RECRUiTER/DynamicNav'; // Assuming DynamicNav is shared and located here

export default function HiringManagerLayout({
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
    <div className="min-h-screen bg-[#050d25] flex">
      <DynamicNav onExpandChange={handleNavExpandChange} userRole="hr_manager" />
      <div className={`flex-1 pt-16 ${isNavExpanded ? 'ml-34' : 'ml-0'} transition-all duration-300 ease-in-out overflow-y-auto h-screen`}>
        <Header isNavExpanded={isNavExpanded} /> {/* Header is now inside the main content area flow but fixed */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}