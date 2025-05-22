'use client';

import React from 'react';
import DynamicNav from './DynamicNav';

export default function HRRecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DynamicNav />
      <main className="flex-1 ml-20">
        {children}
      </main>
    </div>
  );
} 